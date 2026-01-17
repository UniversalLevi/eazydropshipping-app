import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { shopify, sessionStorage } from "../config/shopify.server";
import { getAppUrl } from "../utils/ngrok.server";

// Get scopes from environment (already parsed as array)
const scopesArray = process.env.SCOPES?.split(",") || ["read_products"];

export async function loader({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    throw new Response("Missing shop parameter", { status: 400 });
  }

  // Clean the shop parameter
  const cleanShop = shop.replace(/\.myshopify\.com$/, "") + ".myshopify.com";

  try {
    // Manually construct OAuth URL - auth.begin() requires Node adapter which is incompatible with Remix Web API Request
    // Dynamically get app URL (checks ngrok first, then APP_URL env var, then request origin)
    const appUrl = await getAppUrl(request);
    // Normalize app URL (remove trailing slash if present)
    const normalizedAppUrl = appUrl.replace(/\/$/, "");
    const redirectUri = `${normalizedAppUrl}/auth/callback`;
    const scopes = scopesArray.join(",");
    // Generate a random state/nonce for OAuth
    const state = crypto.randomUUID() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Log the redirect URI for debugging
    console.log("\n" + "=".repeat(70));
    console.log("🔐 OAuth Configuration:");
    console.log("=".repeat(70));
    console.log(`📋 Callback URL: ${redirectUri}`);
    console.log(`🏪 Shop: ${cleanShop}`);
    console.log("=".repeat(70));
    console.log(`\n⚠️  IMPORTANT: Make sure this callback URL is added to your Shopify Partner Dashboard:`);
    console.log(`   ${redirectUri}\n`);
    console.log("=".repeat(70) + "\n");
    
    // Store state for verification in callback
    await sessionStorage.storeSession({
      id: `state-${state}`,
      shop: cleanShop,
      state: state,
      isOnline: false,
    } as any);

    const authUrl = `https://${cleanShop}/admin/oauth/authorize?client_id=${shopify.config.apiKey}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    return redirect(authUrl);
  } catch (error) {
    console.error("OAuth error:", error);
    throw new Response(`OAuth failed: ${error}`, { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  return loader({ request } as any);
}
