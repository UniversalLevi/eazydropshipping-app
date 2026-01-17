import { json, type ActionFunctionArgs } from "@remix-run/node";
import { verifyWebhook } from "../config/shopify.server";
import { Session } from "../models/Session.model";
import { AppData } from "../models/AppData.model";

// This webhook is called when the app is uninstalled
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get webhook body
    const body = await request.text();
    const hmacHeader = request.headers.get("X-Shopify-Hmac-Sha256");

    // Verify webhook signature
    if (!hmacHeader || !verifyWebhook(body, hmacHeader)) {
      console.error("Invalid webhook signature");
      return json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);
    const shop = data.domain || data.myshopify_domain;

    if (!shop) {
      console.error("Missing shop in webhook payload");
      return json({ error: "Missing shop" }, { status: 400 });
    }

    // Clean up all data for this shop
    await Session.deleteMany({ shop });
    await AppData.deleteMany({ shop });

    console.log(`App uninstalled for shop: ${shop}. All data cleaned up.`);

    return json({ success: true });
  } catch (error) {
    console.error("Error handling uninstall webhook:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
