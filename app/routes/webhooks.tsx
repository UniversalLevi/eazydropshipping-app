import { json, type ActionFunctionArgs } from "@remix-run/node";
import { verifyWebhook } from "../config/shopify.server";
import { Session } from "../models/Session.model";
import { AppData } from "../models/AppData.model";

// Handle GDPR compliance webhooks:
// - customers/data_request
// - customers/redact
// - shop/redact

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get webhook body
    const body = await request.text();
    const hmacHeader = request.headers.get("X-Shopify-Hmac-Sha256");
    const topic = request.headers.get("X-Shopify-Topic");

    // Verify webhook signature
    if (!hmacHeader || !verifyWebhook(body, hmacHeader)) {
      console.error("Invalid webhook signature");
      return json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);
    const shop = data.shop_domain || data.shop_email?.split("@")[1];

    if (!shop) {
      console.error("Missing shop in webhook payload");
      return json({ error: "Missing shop" }, { status: 400 });
    }

    switch (topic) {
      case "customers/data_request":
        // Handle customer data request (GDPR)
        // You should export all customer data related to this shop
        console.log(`Data request for shop: ${shop}`, data);
        // In a real app, you would export customer data here
        // For now, we'll just log it
        break;

      case "customers/redact":
        // Handle customer data redaction (GDPR)
        // You should delete all customer data related to this shop
        console.log(`Data redaction for shop: ${shop}`, data);
        // In a real app, you would delete customer data here
        // Note: We're not deleting shop data, only customer-specific data
        break;

      case "shop/redact":
        // Handle shop data redaction (GDPR)
        // You should delete all shop data
        console.log(`Shop data redaction for shop: ${shop}`, data);
        
        // Delete all app data for this shop
        await AppData.deleteMany({ shop });

        // Note: Sessions might still be needed if app is reinstalled
        // Only delete if you want complete removal
        await Session.deleteMany({ shop });

        break;

      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
