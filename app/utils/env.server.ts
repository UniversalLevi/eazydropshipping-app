/**
 * Environment variable validation and utilities
 */

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnv(key: string, defaultValue?: string): string {
  return process.env[key] || defaultValue || "";
}

export const env = {
  // Shopify configuration
  SHOPIFY_API_KEY: getRequiredEnv("SHOPIFY_API_KEY"),
  SHOPIFY_API_SECRET: getRequiredEnv("SHOPIFY_API_SECRET"),
  SCOPES: getEnv("SCOPES", "read_products").split(","),
  
  // Database
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  
  // App URLs
  APP_URL: getEnv("APP_URL", "http://localhost:3000"),
  HOST: getEnv("HOST", "localhost:3000"),
  
  // Environment
  NODE_ENV: getEnv("NODE_ENV", "development"),
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
};

// Validate environment variables on module load
try {
  // This will throw if required vars are missing
  env.SHOPIFY_API_KEY;
  env.SHOPIFY_API_SECRET;
  env.DATABASE_URL;
} catch (error) {
  console.error("❌ Environment validation failed:");
  console.error(error);
  console.error("\n📝 Please check your .env file and ensure all required variables are set.");
  console.error("💡 Copy .env.example to .env and fill in the values.");
  process.exit(1);
}
