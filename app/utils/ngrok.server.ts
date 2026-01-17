/**
 * Utility to get the ngrok public URL dynamically
 * Ngrok provides a local API at http://localhost:4040/api/tunnels
 */
export async function getNgrokUrl(): Promise<string | null> {
  try {
    const response = await fetch("http://localhost:4040/api/tunnels");
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const tunnels = data.tunnels || [];
    
    // Find HTTPS tunnel (preferred) or HTTP tunnel
    const httpsTunnel = tunnels.find((t: any) => t.proto === "https");
    const httpTunnel = tunnels.find((t: any) => t.proto === "http");
    
    const tunnel = httpsTunnel || httpTunnel;
    if (tunnel && tunnel.public_url) {
      return tunnel.public_url;
    }
    
    return null;
  } catch (error) {
    // Ngrok API not available or ngrok not running
    return null;
  }
}

/**
 * Get the app URL - checks ngrok first, then APP_URL env var, then localhost
 */
export async function getAppUrl(request?: Request): Promise<string> {
  // First, try to get ngrok URL dynamically
  const ngrokUrl = await getNgrokUrl();
  if (ngrokUrl) {
    return ngrokUrl;
  }
  
  // Fallback to APP_URL environment variable
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  
  // Last resort: use request origin
  if (request) {
    return new URL(request.url).origin;
  }
  
  // Default to localhost
  return "http://localhost:3000";
}
