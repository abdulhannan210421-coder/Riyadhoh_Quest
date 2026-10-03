// Database Engine IndexedDB untuk Menyimpan Akun & Progress Player
const DB_NAME = 'RiyadhohMonarkDB';
const DB_VERSION = 4;
const STORE_NAME = 'monark_accounts';

class IndexedDBManager {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (db.objectStoreNames.contains(STORE_NAME)) {
                    db.deleteObjectStore(STORE_NAME);
                }
                db.createObjectStore(STORE_NAME, { keyPath: 'storageKey' });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('IndexedDB Error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async saveAccount(accountData) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put({ storageKey: 'active_monark', data: accountData });

            req.onsuccess = () => resolve(true);
            req.onerror = (e) => reject(e.target.error);
        });
    }

    async getAccount(key = 'active_monark') {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(key);

            req.onsuccess = () => {
                const res = req.result;
                resolve(res ? res.data : null);
            };
            req.onerror = (e) => reject(e.target.error);
        });
    }
}

const gameDB = new IndexedDBManager();