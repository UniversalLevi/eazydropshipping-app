import { json, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Card,
  Layout,
  Text,
  Banner,
  Spinner,
  BlockStack,
} from "@shopify/polaris";
import { AppLayout } from "../components/AppLayout";
import { shopify, getSessionFromRequest, createShopifyClient } from "../config/shopify.server";
import { useEffect, useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  // If no shop parameter, return helpful info for development
  if (!shop) {
    return json({
      shop: null,
      host: null,
      authenticated: false,
      shopInfo: null,
      apiKey: process.env.SHOPIFY_API_KEY,
      missingShop: true,
    });
  }

  // Get session
  const session = await getSessionFromRequest(request);

  // Redirect to OAuth if no session or session is missing access token
  if (!session || !session.accessToken) {
    return redirect(`/auth/login?shop=${shop}`);
  }

  // Get shop information
  let shopInfo = null;
  try {
    const client = await createShopifyClient(session);
    const response = await client.query({
      data: {
        query: `
          query {
            shop {
              name
              email
              domain
              plan {
                displayName
              }
            }
          }
        `,
      },
    });

    shopInfo = response.body?.data?.shop;
  } catch (error) {
    console.error("Error fetching shop info:", error);
  }

  return json({
    shop,
    host,
    authenticated: true,
    shopInfo,
    apiKey: process.env.SHOPIFY_API_KEY,
    missingShop: false,
  });
}

export default function Index() {
  const { shop, host, authenticated, shopInfo, apiKey, missingShop } = useLoaderData<typeof loader>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show helpful message if shop parameter is missing
  if (missingShop) {
    return (
      <AppLayout>
        <Page title="Shopify App - Development">
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Welcome to Your Shopify App
                  </Text>
                  <Banner status="info" title="Development Mode">
                    <BlockStack gap="200">
                      <Text as="p">
                        To use this app, you need to access it through Shopify Admin or with a shop parameter.
                      </Text>
                      <Text as="p">
                        <strong>For local development:</strong>
                      </Text>
                      <ul>
                        <li>Use Shopify CLI: <code>shopify app dev</code></li>
                        <li>Or access with: <code>http://localhost:3000?shop=your-store.myshopify.com</code></li>
                        <li>Or install the app through the Shopify Partner Dashboard</li>
                      </ul>
                      <Text as="p">
                        The server is running successfully at <code>http://localhost:3000</code>
                      </Text>
                    </BlockStack>
                  </Banner>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </AppLayout>
    );
  }

  if (!mounted) {
    return (
      <AppLayout>
        <Page>
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Loading...
                  </Text>
                  <Spinner accessibilityLabel="Loading" size="small" />
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Page
        title="Welcome to Your Shopify App"
        primaryAction={{
          content: "Get Started",
          onAction: () => {
            console.log("Get started clicked");
          },
        }}
      >
        <Layout>
          <Layout.Section>
            <Banner status="info" title="App is successfully installed!">
              <p>Your Shopify app is now connected and ready to use.</p>
            </Banner>
          </Layout.Section>

          {shopInfo && (
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Shop Information
                  </Text>
                  <BlockStack gap="200">
                    <Text as="p">
                      <strong>Shop Name:</strong> {shopInfo.name}
                    </Text>
                    <Text as="p">
                      <strong>Shop Domain:</strong> {shopInfo.domain}
                    </Text>
                    {shopInfo.email && (
                      <Text as="p">
                        <strong>Email:</strong> {shopInfo.email}
                      </Text>
                    )}
                    {shopInfo.plan && (
                      <Text as="p">
                        <strong>Plan:</strong> {shopInfo.plan.displayName}
                      </Text>
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}

          <Layout.Section>
            <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Next Steps
                  </Text>
                  <BlockStack gap="200">
                  <Text as="p">
                    1. Customize this app to add your specific features
                  </Text>
                  <Text as="p">
                    2. Configure webhooks for your app's needs
                  </Text>
                  <Text as="p">
                    3. Add your app logic and business requirements
                  </Text>
                  <Text as="p">
                    4. Test thoroughly before submitting to Shopify App Store
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppLayout>
  );
}
