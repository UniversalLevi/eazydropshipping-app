import "@shopify/shopify-api/adapters/node";
import {
  shopifyApi,
  ApiVersion,
  LogSeverity,
} from "@shopify/shopify-api";
import {
  storeSession,
  loadSession,
  deleteSession,
  deleteSessions,
  findSessionsByShop,
  type SessionData,
} from "../storage/memory.server";

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

// Session storage implementation using in-memory storage
const sessionStorageImpl = {
  async storeSession(session: any): Promise<boolean> {
    return storeSession({
      id: session.id,
      shop: session.shop,
      state: session.state || undefined,
      scope: session.scope || undefined,
      expires: session.expires || undefined,
      accessToken: session.accessToken || "",
      isOnline: session.isOnline || false,
    });
  },

  async loadSession(id: string): Promise<SessionData | undefined> {
    const sessionData = loadSession(id);

    if (!sessionData) {
      return undefined;
    }

    return {
      id: sessionData.id,
      shop: sessionData.shop,
      state: sessionData.state,
      scope: sessionData.scope,
      expires: sessionData.expires,
      accessToken: sessionData.accessToken,
      isOnline: sessionData.isOnline,
      createdAt: sessionData.createdAt,
      updatedAt: sessionData.updatedAt,
    };
  },

  async deleteSession(id: string): Promise<boolean> {
    return deleteSession(id);
  },

  async deleteSessions(ids: string[]): Promise<boolean> {
    return deleteSessions(ids);
  },

  async findSessionsByShop(shop: string): Promise<SessionData[]> {
    const sessions = findSessionsByShop(shop);
    return sessions.map((session) => ({
      id: session.id,
      shop: session.shop,
      state: session.state,
      scope: session.scope,
      expires: session.expires,
      accessToken: session.accessToken,
      isOnline: session.isOnline,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));
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
    level: LogSeverity.Warning,
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
