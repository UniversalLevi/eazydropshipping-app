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
      <Page title="Dashboard">
        <Layout>
          <Layout.Section>
            <Banner status="success" title="App Successfully Installed!">
              <p>Your Shopify app is now connected and ready to use. You can start managing your store operations.</p>
            </Banner>
          </Layout.Section>

          {shopInfo && (
            <Layout.Section>
              <Card>
                <BlockStack gap="500">
                  <Text variant="headingMd" as="h2">
                    Store Information
                  </Text>
                  <Card sectioned>
                    <BlockStack gap="300">
                      <div>
                        <Text variant="bodyMd" fontWeight="semibold" as="p">
                          Shop Name
                        </Text>
                        <Text as="p" tone="subdued">
                          {shopInfo.name}
                        </Text>
                      </div>
                      <div>
                        <Text variant="bodyMd" fontWeight="semibold" as="p">
                          Shop Domain
                        </Text>
                        <Text as="p" tone="subdued">
                          {shopInfo.domain}
                        </Text>
                      </div>
                      {shopInfo.email && (
                        <div>
                          <Text variant="bodyMd" fontWeight="semibold" as="p">
                            Email
                          </Text>
                          <Text as="p" tone="subdued">
                            {shopInfo.email}
                          </Text>
                        </div>
                      )}
                      {shopInfo.plan && (
                        <div>
                          <Text variant="bodyMd" fontWeight="semibold" as="p">
                            Plan
                          </Text>
                          <Text as="p" tone="subdued">
                            {shopInfo.plan.displayName}
                          </Text>
                        </div>
                      )}
                    </BlockStack>
                  </Card>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}

          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <Text variant="headingMd" as="h2">
                  Getting Started
                </Text>
                <Card sectioned>
                  <BlockStack gap="300">
                    <Text as="p">
                      <strong>1.</strong> Customize this app to add your specific features and functionality
                    </Text>
                    <Text as="p">
                      <strong>2.</strong> Configure webhooks to handle events from your store
                    </Text>
                    <Text as="p">
                      <strong>3.</strong> Implement your app logic and business requirements
                    </Text>
                    <Text as="p">
                      <strong>4.</strong> Test thoroughly in development before submitting to the Shopify App Store
                    </Text>
                  </BlockStack>
                </Card>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppLayout>
  );
}
