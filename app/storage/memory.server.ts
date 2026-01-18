/**
 * In-memory storage for sessions and app data
 * 
 * WARNING: This storage is ephemeral - data is lost when the server restarts
 * or when running on serverless platforms like Vercel (each request may use
 * a different instance). This is suitable for testing/demo only.
 */

// Session data interface
export interface SessionData {
  id: string;
  shop: string;
  state?: string;
  scope?: string;
  expires?: Date;
  accessToken: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage using Maps
// Using global to persist across hot reloads in development
declare global {
  var __sessions__: Map<string, SessionData> | undefined;
  var __appData__: Map<string, Map<string, string>> | undefined;
}

// Initialize or reuse existing storage
const sessions: Map<string, SessionData> = global.__sessions__ || new Map();
const appData: Map<string, Map<string, string>> = global.__appData__ || new Map();

// Persist in global for development hot reloads
if (process.env.NODE_ENV === "development") {
  global.__sessions__ = sessions;
  global.__appData__ = appData;
}

// ==================== SESSION OPERATIONS ====================

/**
 * Store a session (creates or updates)
 */
export function storeSession(session: Partial<SessionData> & { shop: string }): boolean {
  try {
    const now = new Date();
    const existingSession = findSessionByShop(session.shop);
    
    const sessionData: SessionData = {
      id: session.id || existingSession?.id || `session_${session.shop}_${Date.now()}`,
      shop: session.shop,
      state: session.state,
      scope: session.scope,
      expires: session.expires,
      accessToken: session.accessToken || "",
      isOnline: session.isOnline || false,
      createdAt: existingSession?.createdAt || now,
      updatedAt: now,
    };

    // Store by both id and shop for easy lookup
    sessions.set(sessionData.id, sessionData);
    
    return true;
  } catch (error) {
    console.error("Error storing session:", error);
    return false;
  }
}

/**
 * Load a session by ID
 */
export function loadSession(id: string): SessionData | undefined {
  return sessions.get(id);
}

/**
 * Find a session by shop domain
 */
export function findSessionByShop(shop: string): SessionData | undefined {
  for (const session of sessions.values()) {
    if (session.shop === shop) {
      return session;
    }
  }
  return undefined;
}

/**
 * Find all sessions for a shop (with valid access tokens)
 */
export function findSessionsByShop(shop: string): SessionData[] {
  const result: SessionData[] = [];
  for (const session of sessions.values()) {
    if (session.shop === shop && session.accessToken) {
      result.push(session);
    }
  }
  return result;
}

/**
 * Delete a session by ID
 */
export function deleteSession(id: string): boolean {
  return sessions.delete(id);
}

/**
 * Delete multiple sessions by IDs
 */
export function deleteSessions(ids: string[]): boolean {
  for (const id of ids) {
    sessions.delete(id);
  }
  return true;
}

/**
 * Delete all sessions for a shop
 */
export function deleteSessionsByShop(shop: string): boolean {
  const toDelete: string[] = [];
  for (const [id, session] of sessions.entries()) {
    if (session.shop === shop) {
      toDelete.push(id);
    }
  }
  for (const id of toDelete) {
    sessions.delete(id);
  }
  return true;
}

// ==================== APP DATA OPERATIONS ====================

/**
 * Set app data for a shop
 */
export function setAppData(shop: string, key: string, value: string): boolean {
  try {
    if (!appData.has(shop)) {
      appData.set(shop, new Map());
    }
    appData.get(shop)!.set(key, value);
    return true;
  } catch (error) {
    console.error("Error setting app data:", error);
    return false;
  }
}

/**
 * Get app data for a shop
 */
export function getAppData(shop: string, key: string): string | undefined {
  return appData.get(shop)?.get(key);
}

/**
 * Delete specific app data for a shop
 */
export function deleteAppData(shop: string, key: string): boolean {
  return appData.get(shop)?.delete(key) || false;
}

/**
 * Delete all app data for a shop
 */
export function deleteAllAppData(shop: string): boolean {
  return appData.delete(shop);
}

/**
 * Delete all data for a shop (sessions + app data)
 */
export function deleteAllShopData(shop: string): boolean {
  deleteSessionsByShop(shop);
  deleteAllAppData(shop);
  return true;
}

// ==================== DEBUG/UTILITY ====================

/**
 * Get storage stats (for debugging)
 */
export function getStorageStats(): { sessionCount: number; shopCount: number } {
  const shops = new Set<string>();
  for (const session of sessions.values()) {
    shops.add(session.shop);
  }
  return {
    sessionCount: sessions.size,
    shopCount: shops.size,
  };
}
