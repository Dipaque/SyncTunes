/**
 * A utility class to handle asynchronous client-side caching using IndexedDB.
 * Designed to safely store and retrieve large datasets (like user libraries) 
 * without blocking the browser's main thread.
 */
export class IndexedDBHelper {
  /**
   * Initializes a new instance of the IndexedDB helper.
   * 
   * @param {string} dbName - The name of the IndexedDB database (e.g., 'SyncMusicCache').
   * @param {string} storeName - The name of the object store inside the DB (e.g., 'library_cache').
   */
  constructor(dbName, storeName) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  /**
   * Opens the connection to the IndexedDB database. 
   * Automatically creates the object store if it does not exist during a version upgrade.
   * 
   * @private
   * @returns {Promise<IDBDatabase>} A promise that resolves with the active database instance.
   */
  initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        // Check if store exists before creating to prevent versioning crashes
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Saves or updates data in the object store.
   * 
   * @param {string} key - The unique identifier to store the data under (e.g., 'home_data_english').
   * @param {any} data - The data payload to cache (Objects, Arrays, Strings, etc.).
   * @returns {Promise<void>} A promise that resolves when the data is successfully written to the database.
   */
  async set(key, data) {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).put(data, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn(`[IndexedDB] Set failed for ${this.dbName}:`, err);
    }
  }

  /**
   * Retrieves data from the object store using its key.
   * 
   * @param {string} key - The unique identifier of the data you want to retrieve.
   * @returns {Promise<any | null>} A promise that resolves with the cached data, or `null` if the key doesn't exist or an error occurs.
   */
  async get(key) {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const req = tx.objectStore(this.storeName).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`[IndexedDB] Get failed for ${this.dbName}:`, err);
      return null;
    }
  }
}