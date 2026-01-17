import "@shopify/shopify-api/adapters/node";
import {
  shopifyApi,
  ApiVersion,
  BillingInterval,
  LogSeverity,
} from "@shopify/shopify-api";
import { connectDB } from "./database.server";
import { Session } from "../models/Session.model";

// Ensure required environment variables are set
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = process.env.SCOPES?.split(",") || ["read_products"];
// HOST should be just the domain, not include port
const hostName = process.env.HOST?.replace(/https?:\/\//, "").split(":")[0] || "localhost";
const appUrl = process.env.APP_URL || `https://${hostName}`;

if (!apiKey || !apiSecret) {
  throw new Error("Missing required Shopify environment variables");
}

// Ensure MongoDB is connected before initializing Shopify
connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

// Session storage implementation using Mongoose (must be defined before shopify initialization)
const sessionStorageImpl = {
  async storeSession(session: any) {
    try {
      await Session.findOneAndUpdate(
        { shop: session.shop },
        {
          id: session.id,
          shop: session.shop,
          state: session.state || undefined,
          scope: session.scope || undefined,
          expires: session.expires || undefined,
          accessToken: session.accessToken || "",
          isOnline: session.isOnline || false,
        },
        {
          upsert: true,
          new: true,
        }
      );
      return true;
    } catch (error) {
      console.error("Error storing session:", error);
      return false;
    }
  },

  async loadSession(id: string) {
    try {
      const sessionData = await Session.findOne({ id });

      if (!sessionData) {
        return undefined;
      }

      return {
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state || undefined,
        scope: sessionData.scope || undefined,
        expires: sessionData.expires || undefined,
        accessToken: sessionData.accessToken,
        isOnline: sessionData.isOnline,
      };
    } catch (error) {
      console.error("Error loading session:", error);
      return undefined;
    }
  },

  async deleteSession(id: string) {
    try {
      await Session.deleteOne({ id });
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  },

  async deleteSessions(ids: string[]) {
    try {
      await Session.deleteMany({ id: { $in: ids } });
      return true;
    } catch (error) {
      console.error("Error deleting sessions:", error);
      return false;
    }
  },

  async findSessionsByShop(shop: string) {
    try {
      // Only find sessions that have an accessToken (completed OAuth)
      const sessions = await Session.find({ 
        shop,
        accessToken: { $exists: true, $ne: "" }
      });

      return sessions.map((session) => ({
        id: session.id,
        shop: session.shop,
        state: session.state || undefined,
        scope: session.scope || undefined,
        expires: session.expires || undefined,
        accessToken: session.accessToken,
        isOnline: session.isOnline,
      }));
    } catch (error) {
      console.error("Error finding sessions by shop:", error);
      return [];
    }
  },
};

// Initialize Shopify API
export const shopify = shopifyApi({
  apiKey,
  apiSecretKey: apiSecret,
  scopes,
  hostName,
  apiVersion: ApiVersion.July24,
  isEmbeddedApp: true,
  logger: {
    level: LogSeverity.Warning, // Reduced logging level
    httpRequests: false,
  },
  sessionStorage: sessionStorageImpl,
});

// Export session storage for use in routes
export const sessionStorage = sessionStorageImpl;

// Helper function to get Shopify session from request
export async function getSessionFromRequest(request: Request) {
  const shop = new URL(request.url).searchParams.get("shop");
  if (!shop) {
    return null;
  }

  const sessions = await sessionStorage.findSessionsByShop(shop);
  return sessions.length > 0 ? sessions[0] : null;
}

// Helper function to create authenticated Shopify client
export async function createShopifyClient(session: any) {
  return new shopify.clients.Graphql({ session });
}

// Helper function to verify webhook HMAC
export function verifyWebhook(webhookBody: string, hmacHeader: string): boolean {
  if (!hmacHeader) {
    return false;
  }

  try {
    const generatedHash = shopify.utils.sha256HMAC(apiSecret, webhookBody);
    return generatedHash === hmacHeader;
  } catch (error) {
    console.error("Error verifying webhook:", error);
    return false;
  }
}
