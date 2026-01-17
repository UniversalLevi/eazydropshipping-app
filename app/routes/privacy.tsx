import type { MetaFunction } from "@remix-run/node";
import { Layout, Page, Text, Card, BlockStack } from "@shopify/polaris";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy - Shopify App" },
    { name: "description", content: "Privacy Policy for Shopify App" },
  ];
};

export default function Privacy() {
  return (
    <Page title="Privacy Policy">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Privacy Policy
              </Text>
              
              <Text as="p">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </Text>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Information We Collect
                </Text>
                <Text as="p">
                  Our Shopify app collects and stores the following information:
                </Text>
                <ul>
                  <li>Shop information (name, domain, email, plan)</li>
                  <li>OAuth access tokens for API access</li>
                  <li>App-specific data configured by the merchant</li>
                </ul>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  How We Use Your Information
                </Text>
                <Text as="p">
                  We use the collected information to:
                </Text>
                <ul>
                  <li>Provide and maintain the app's functionality</li>
                  <li>Communicate with you about your account</li>
                  <li>Improve our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Data Security
                </Text>
                <Text as="p">
                  We implement appropriate security measures to protect your data.
                  Access tokens are stored securely in our database and are encrypted
                  at rest. We do not share your data with third parties except as
                  required by law.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Your Rights (GDPR)
                </Text>
                <Text as="p">
                  Under GDPR, you have the right to:
                </Text>
                <ul>
                  <li>Request access to your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Request data portability</li>
                </ul>
                <Text as="p">
                  To exercise these rights, please contact us through the support
                  email provided in the app listing.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Data Retention
                </Text>
                <Text as="p">
                  We retain your data as long as your app is installed. When you
                  uninstall the app, we delete all associated data within 30 days,
                  unless required to retain it for legal purposes.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Changes to This Policy
                </Text>
                <Text as="p">
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new policy on this page
                  and updating the "Last Updated" date.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">
                  Contact Us
                </Text>
                <Text as="p">
                  If you have questions about this privacy policy, please contact
                  us through the support email provided in the Shopify App Store listing.
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
