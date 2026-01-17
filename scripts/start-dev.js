#!/usr/bin/env node

/**
 * Development startup script that:
 * 1. Starts ngrok tunnel
 * 2. Gets the ngrok URL
 * 3. Starts the Remix dev server
 * 4. Outputs the callback URL for Shopify setup
 */

import { spawn } from "child_process";

let ngrokUrl = null;
let ngrokProcess = null;

// Start ngrok
console.log("🚀 Starting ngrok tunnel...");
ngrokProcess = spawn("ngrok", ["http", "3000", "--log=stdout"], {
  stdio: ["ignore", "pipe", "inherit"],
});

// Wait for ngrok to start and get the URL
const waitForNgrok = () => {
  return new Promise((resolve) => {
    const checkNgrok = async () => {
      try {
        const response = await fetch("http://localhost:4040/api/tunnels");
        if (response.ok) {
          const data = await response.json();
          const tunnels = data.tunnels || [];
          const httpsTunnel = tunnels.find((t) => t.proto === "https");
          const httpTunnel = tunnels.find((t) => t.proto === "http");
          const tunnel = httpsTunnel || httpTunnel;
          
          if (tunnel && tunnel.public_url) {
            ngrokUrl = tunnel.public_url;
            resolve(ngrokUrl);
            return;
          }
        }
      } catch (error) {
        // Not ready yet
      }
      
      setTimeout(checkNgrok, 1000);
    };
    
    // Start checking after 2 seconds (give ngrok time to start)
    setTimeout(checkNgrok, 2000);
  });
};

// Start Remix dev server
const startRemix = () => {
  console.log("🎨 Starting Remix development server...");
  const remixProcess = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  });
  
  remixProcess.on("exit", (code) => {
    if (ngrokProcess) {
      ngrokProcess.kill();
    }
    process.exit(code);
  });
};

// Main flow
(async () => {
  try {
    const url = await waitForNgrok();
    
    console.log("\n" + "=".repeat(70));
    console.log("✅ Ngrok tunnel is active!");
    console.log("=".repeat(70));
    console.log(`🌐 Public URL: ${url}`);
    console.log(`📋 Callback URL: ${url}/auth/callback`);
    console.log("=".repeat(70));
    console.log("\n📝 Add this callback URL to your Shopify Partner Dashboard:");
    console.log(`   ${url}/auth/callback`);
    console.log("\n💡 The app will automatically use this ngrok URL for OAuth.");
    console.log("   You don't need to set APP_URL in .env when using this script.\n");
    console.log("=".repeat(70) + "\n");
    
    startRemix();
  } catch (error) {
    console.error("❌ Error starting ngrok:", error);
    console.error("\n💡 Make sure ngrok is installed and authenticated:");
    console.error("   1. Install ngrok: https://ngrok.com/download");
    console.error("   2. Get auth token: https://dashboard.ngrok.com/get-started/your-authtoken");
    console.error("   3. Configure: ngrok config add-authtoken YOUR_TOKEN");
    process.exit(1);
  }
})();

// Cleanup on exit
process.on("SIGINT", () => {
  if (ngrokProcess) {
    ngrokProcess.kill();
  }
  process.exit(0);
});
