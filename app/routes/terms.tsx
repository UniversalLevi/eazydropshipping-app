import type { MetaFunction } from "@remix-run/node";
import { Layout, Page, Text, Card, BlockStack } from "@shopify/polaris";

export const meta: MetaFunction = () => {
  return [
    { title: "Terms of Service - Shopify App" },
    { name: "description", content: "Terms of Service for Shopify App" },
  ];
};

export default function Terms() {
  return (
    <Page title="Terms of Service">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Terms of Service
              </Text>
              
              <Text as="p">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </Text>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Acceptance of Terms
                </Text>
                <Text as="p">
                  By installing and using this Shopify app, you agree to be bound
                  by these Terms of Service. If you do not agree to these terms,
                  please do not use the app.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Description of Service
                </Text>
                <Text as="p">
                  This app provides services that integrate with your Shopify store.
                  The specific features and functionality are described in the app
                  listing on the Shopify App Store.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Use License
                </Text>
                <Text as="p">
                  Permission is granted to temporarily use this app for personal or
                  commercial purposes. This license is subject to the following
                  restrictions:
                </Text>
                <ul>
                  <li>You may not modify or copy the app's code</li>
                  <li>You may not use the app for any unlawful purpose</li>
                  <li>You may not attempt to gain unauthorized access to the app</li>
                </ul>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  User Responsibilities
                </Text>
                <Text as="p">
                  You are responsible for:
                </Text>
                <ul>
                  <li>Maintaining the security of your Shopify account</li>
                  <li>All activities that occur under your account</li>
                  <li>Ensuring your use of the app complies with applicable laws</li>
                  <li>Backing up your data</li>
                </ul>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Service Availability
                </Text>
                <Text as="p">
                  We strive to provide reliable service but do not guarantee that
                  the app will be available 100% of the time. The app may be
                  temporarily unavailable due to maintenance, updates, or unforeseen
                  circumstances. We are not liable for any loss or damage resulting
                  from service unavailability.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Limitation of Liability
                </Text>
                <Text as="p">
                  To the maximum extent permitted by law, we shall not be liable
                  for any indirect, incidental, special, consequential, or punitive
                  damages, or any loss of profits or revenues, whether incurred
                  directly or indirectly, or any loss of data, use, goodwill, or
                  other intangible losses resulting from your use of the app.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Termination
                </Text>
                <Text as="p">
                  We reserve the right to terminate or suspend your access to the
                  app immediately, without prior notice, for any reason, including
                  if you breach these Terms of Service. Upon termination, your right
                  to use the app will cease immediately.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Changes to Terms
                </Text>
                <Text as="p">
                  We reserve the right to modify these terms at any time. We will
                  notify users of any material changes by updating the "Last Updated"
                  date. Your continued use of the app after changes constitutes
                  acceptance of the new terms.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Governing Law
                </Text>
                <Text as="p">
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of the jurisdiction in which the app
                  developer is located, without regard to its conflict of law provisions.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Contact Information
                </Text>
                <Text as="p">
                  If you have any questions about these Terms of Service, please
                  contact us through the support email provided in the Shopify App Store listing.
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
