import { IndexedDBHelper } from './indexedDB'; // Your helper class

// We initialize this ONCE for the entire application
export const appCache = new IndexedDBHelper('SyncAppDB', 'app_cache');