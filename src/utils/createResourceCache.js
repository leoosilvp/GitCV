const DEFAULT_TTL_MS = 5 * 60 * 1000

const EMPTY_SNAPSHOT = Object.freeze({ data: null, isLoading: true, error: null, isStale: true })

export function createResourceCache(fetcher, { ttlMs = DEFAULT_TTL_MS } = {}) {
    const entries = new Map()
    const snapshots = new Map()
    const inflight = new Map()
    const subscribers = new Map()

    function notify(key) {
        const listeners = subscribers.get(key)
        if (!listeners) return
        for (const listener of listeners) listener()
    }

    function subscribe(key, listener) {
        if (!subscribers.has(key)) subscribers.set(key, new Set())
        subscribers.get(key).add(listener)

        return () => {
            const listeners = subscribers.get(key)
            if (!listeners) return
            listeners.delete(listener)
            if (listeners.size === 0) subscribers.delete(key)
        }
    }

    function getSnapshot(key) {
        const entry = entries.get(key)

        if (!entry) return EMPTY_SNAPSHOT

        const cached = snapshots.get(key)
        if (cached && cached.entry === entry) return cached.snapshot

        const snapshot = {
            data: entry.data,
            error: entry.error,
            isLoading: false,
            isStale: Date.now() > entry.expiresAt,
        }

        snapshots.set(key, { entry, snapshot })
        return snapshot
    }

    function revalidate(key, ...args) {
        if (inflight.has(key)) return inflight.get(key)

        const promise = fetcher(key, ...args)
            .then((data) => {
                entries.set(key, { data, error: null, expiresAt: Date.now() + ttlMs })
                notify(key)
                return data
            })
            .catch((error) => {
                const previous = entries.get(key)
                entries.set(key, {
                    data: previous?.data ?? null,
                    error,
                    expiresAt: Date.now(),
                })
                notify(key)
                throw error
            })
            .finally(() => {
                inflight.delete(key)
            })

        inflight.set(key, promise)
        return promise
    }

    function ensureFresh(key, ...args) {
        const entry = entries.get(key)
        if (entry && Date.now() <= entry.expiresAt) return
        revalidate(key, ...args).catch(() => { })
    }

    function invalidate(key) {
        entries.delete(key)
        snapshots.delete(key)
        notify(key)
    }

    return { subscribe, getSnapshot, ensureFresh, revalidate, invalidate }
}