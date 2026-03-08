import { initOfflineDB, offlineDB } from '../offlineDB'

type SyncType = 'order' | 'inquiry' | 'preferences'
type SyncStatus = 'pending' | 'syncing' | 'success' | 'error'

interface SyncRecord {
  id: string
  type: SyncType
  data: unknown
  timestamp: number
  retryCount: number
  status: SyncStatus
}

interface MockController {
  failOpen: boolean
  failAdd: boolean
  failGetAll: boolean
  failGet: boolean
  failPut: boolean
  failDelete: boolean
}

const flush = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

const createMockIndexedDB = (controller: MockController) => {
  const data = new Map<string, SyncRecord>()

  const makeRequest = () => ({
    onsuccess: undefined as undefined | ((event?: unknown) => void),
    onerror: undefined as undefined | ((event?: unknown) => void),
    onupgradeneeded: undefined as undefined | ((event?: unknown) => void),
    result: undefined as unknown,
  })

  const asyncSuccess = (req: ReturnType<typeof makeRequest>, result?: unknown) => {
    setTimeout(() => {
      req.result = result
      req.onsuccess?.({ target: req })
    }, 0)
  }

  const asyncError = (req: ReturnType<typeof makeRequest>) => {
    setTimeout(() => {
      req.onerror?.({ target: req })
    }, 0)
  }

  const store = {
    add: (item: SyncRecord) => {
      const req = makeRequest()
      if (controller.failAdd) {
        controller.failAdd = false
        asyncError(req)
        return req
      }
      data.set(item.id, item)
      asyncSuccess(req, item.id)
      return req
    },
    get: (id: string) => {
      const req = makeRequest()
      if (controller.failGet) {
        controller.failGet = false
        asyncError(req)
        return req
      }
      asyncSuccess(req, data.get(id))
      return req
    },
    put: (item: SyncRecord) => {
      const req = makeRequest()
      if (controller.failPut) {
        controller.failPut = false
        asyncError(req)
        return req
      }
      data.set(item.id, item)
      asyncSuccess(req, item)
      return req
    },
    delete: (id: string) => {
      const req = makeRequest()
      if (controller.failDelete) {
        controller.failDelete = false
        asyncError(req)
        return req
      }
      data.delete(id)
      asyncSuccess(req)
      return req
    },
    index: (name: string) => ({
      getAll: (value: string) => {
        const req = makeRequest()
        if (controller.failGetAll) {
          controller.failGetAll = false
          asyncError(req)
          return req
        }
        if (name === 'status') {
          const values = [...data.values()].filter(item => item.status === value)
          asyncSuccess(req, values)
          return req
        }
        asyncSuccess(req, [...data.values()])
        return req
      },
    }),
    createIndex: jest.fn(),
  }

  const db = {
    objectStoreNames: {
      contains: jest.fn().mockReturnValue(false),
    },
    deleteObjectStore: jest.fn(),
    createObjectStore: jest.fn().mockReturnValue(store),
    transaction: jest.fn().mockReturnValue({
      objectStore: jest.fn().mockReturnValue(store),
    }),
  }

  const indexedDBMock = {
    open: jest.fn(() => {
      const req = makeRequest()

      setTimeout(() => {
        if (controller.failOpen) {
          controller.failOpen = false
          req.onerror?.({ target: req })
          return
        }

        req.result = db
        req.onupgradeneeded?.({ target: req })
        req.onsuccess?.({ target: req })
      }, 0)

      return req
    }),
  }

  return { indexedDBMock }
}

describe('offlineDB', () => {
  const controller: MockController = {
    failOpen: false,
    failAdd: false,
    failGetAll: false,
    failGet: false,
    failPut: false,
    failDelete: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(controller, {
      failOpen: false,
      failAdd: false,
      failGetAll: false,
      failGet: false,
      failPut: false,
      failDelete: false,
    })

    const { indexedDBMock } = createMockIndexedDB(controller)
    Object.defineProperty(global, 'indexedDB', {
      configurable: true,
      value: indexedDBMock,
    })
  })

  it('initializes DB and handles full data lifecycle', async () => {
    await offlineDB.init()

    const orderId = await offlineDB.addSyncData('order', { flower: 'rose' })
    const inquiryId = await offlineDB.addSyncData('inquiry', { message: 'hello' })
    await offlineDB.addSyncData('preferences', { locale: 'ko' })

    const pendingAll = await offlineDB.getPendingData()
    expect(pendingAll.length).toBe(3)

    const pendingOrders = await offlineDB.getPendingData('order')
    expect(pendingOrders.length).toBe(1)
    expect(pendingOrders[0].id).toBe(orderId)

    await offlineDB.updateSyncStatus(orderId, 'success', 2)

    const counts = await offlineDB.getPendingCounts()
    expect(counts).toEqual({ orders: 0, inquiries: 1, preferences: 1 })

    await offlineDB.clearSuccessfulData()

    const afterClear = await offlineDB.getPendingData()
    expect(afterClear.find(item => item.id === orderId)).toBeUndefined()

    await offlineDB.deleteSyncData(inquiryId)
    const afterDelete = await offlineDB.getPendingData()
    expect(afterDelete.length).toBe(1)
  })

  it('throws when updating status for a missing record', async () => {
    await offlineDB.init()

    await expect(offlineDB.updateSyncStatus('missing-id', 'error')).rejects.toThrow('Sync data not found')
  })

  it('handles init open failure', async () => {
    controller.failOpen = true

    await expect(offlineDB.init()).rejects.toThrow('Failed to open IndexedDB')
  })

  it('handles add/get/update/delete/getAll failures', async () => {
    await offlineDB.init()

    controller.failAdd = true
    await expect(offlineDB.addSyncData('order', { x: 1 })).rejects.toThrow('Failed to add sync data')

    const id = await offlineDB.addSyncData('order', { x: 2 })

    controller.failGetAll = true
    await expect(offlineDB.getPendingData()).rejects.toThrow('Failed to get pending data')

    controller.failGet = true
    await expect(offlineDB.updateSyncStatus(id, 'syncing')).rejects.toThrow('Failed to get sync data')

    controller.failPut = true
    await expect(offlineDB.updateSyncStatus(id, 'error')).rejects.toThrow('Failed to update sync status')

    controller.failDelete = true
    await expect(offlineDB.deleteSyncData(id)).rejects.toThrow('Failed to delete sync data')

    controller.failGetAll = true
    await expect(offlineDB.getPendingCounts()).rejects.toThrow('Failed to get pending counts')

    controller.failGetAll = true
    await expect(offlineDB.clearSuccessfulData()).rejects.toThrow('Failed to get successful data')
  })

  it('initOfflineDB logs success and handles failure fallback', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    await initOfflineDB()
    await flush()

    expect(logSpy).toHaveBeenCalledWith('OfflineDB initialized successfully')

    const initSpy = jest.spyOn(offlineDB, 'init').mockRejectedValueOnce(new Error('init fail'))

    await initOfflineDB()

    expect(errorSpy).toHaveBeenCalledWith('Failed to initialize OfflineDB:', expect.any(Error))
    expect(warnSpy).toHaveBeenCalledWith('Falling back to localStorage for offline storage')

    initSpy.mockRestore()
    logSpy.mockRestore()
    errorSpy.mockRestore()
    warnSpy.mockRestore()
  })
})
