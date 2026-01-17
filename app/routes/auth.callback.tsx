import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { shopify, sessionStorage } from "../config/shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    throw new Response("Missing shop parameter", { status: 400 });
  }

  try {
    // Complete OAuth flow
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: new Response(),
    });

    const { session } = callbackResponse;

    if (!session) {
      throw new Error("No session returned from OAuth callback");
    }

    // Store session in database
    await sessionStorage.storeSession(session);

    // Redirect to app home
    const cleanShop = shop.replace(/\.myshopify\.com$/, "") + ".myshopify.com";
    return redirect(`/?shop=${cleanShop}&host=${url.searchParams.get("host")}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    throw new Response(`OAuth callback failed: ${error}`, { status: 500 });
  }
}
