/**
 * IndexedDB를 사용한 오프라인 데이터 저장소 유틸리티
 * 백그라운드 동기화를 위한 안정적인 데이터 저장 제공
 */

interface SyncData {
  id: string;
  type: 'order' | 'inquiry' | 'preferences';
  data: unknown; // Record<string, unknown> 대신 unknown 사용
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'success' | 'error';
}

class OfflineDB {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'MiracleFlowerOffline';
  private readonly version = 1;
  private readonly storeName = 'syncData';

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB not available on server'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 기존 스토어가 있다면 삭제하고 새로 생성
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }

        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  async addSyncData(type: SyncData['type'], data: unknown): Promise<string> {
    const db = await this.ensureDB();
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const syncData: SyncData = {
      id,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(syncData);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('Failed to add sync data'));
    });
  }

  async getPendingData(type?: SyncData['type']): Promise<SyncData[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('status');
      const request = index.getAll('pending');

      request.onsuccess = () => {
        let results = request.result;
        if (type) {
          results = results.filter(item => item.type === type);
        }
        resolve(results);
      };

      request.onerror = () => reject(new Error('Failed to get pending data'));
    });
  }

  async updateSyncStatus(id: string, status: SyncData['status'], retryCount?: number): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.status = status;
          if (retryCount !== undefined) {
            data.retryCount = retryCount;
          }

          const updateRequest = store.put(data);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(new Error('Failed to update sync status'));
        } else {
          reject(new Error('Sync data not found'));
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to get sync data'));
    });
  }

  async deleteSyncData(id: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete sync data'));
    });
  }

  async getPendingCounts(): Promise<{ orders: number; inquiries: number; preferences: number }> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('status');
      const request = index.getAll('pending');

      request.onsuccess = () => {
        const results = request.result;
        const counts = {
          orders: results.filter(item => item.type === 'order').length,
          inquiries: results.filter(item => item.type === 'inquiry').length,
          preferences: results.filter(item => item.type === 'preferences').length
        };
        resolve(counts);
      };

      request.onerror = () => reject(new Error('Failed to get pending counts'));
    });
  }

  async clearSuccessfulData(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('status');
      const request = index.getAll('success');

      request.onsuccess = () => {
        const successfulItems = request.result;
        const deletePromises = successfulItems.map(item =>
          new Promise<void>((deleteResolve, deleteReject) => {
            const deleteRequest = store.delete(item.id);
            deleteRequest.onsuccess = () => deleteResolve();
            deleteRequest.onerror = () => deleteReject();
          })
        );

        Promise.all(deletePromises)
          .then(() => resolve())
          .catch(() => reject(new Error('Failed to clear successful data')));
      };

      request.onerror = () => reject(new Error('Failed to get successful data'));
    });
  }
}

// 싱글톤 인스턴스
export const offlineDB = new OfflineDB();

// 초기화 함수 (앱 시작 시 호출)
export const initOfflineDB = async (): Promise<void> => {
  try {
    await offlineDB.init();
    console.log('OfflineDB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize OfflineDB:', error);
    // IndexedDB를 사용할 수 없는 경우 localStorage로 폴백
    console.warn('Falling back to localStorage for offline storage');
  }
};
