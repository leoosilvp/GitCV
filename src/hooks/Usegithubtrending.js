import { useCallback, useEffect, useRef, useState } from "react";

const TRENDING_API_BASE = "https://api.gitterapp.com/repositories";
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;
const DEFAULT_RETRY_COUNT = 2;
const DEFAULT_RETRY_DELAY = 500;

const cacheStore = new Map();
const inFlightRequests = new Map();

function buildCacheKey(since, language) {
  return `${since}:${language ? language.toLowerCase() : "all"}`;
}

function getCachedEntry(key) {
  return cacheStore.get(key) ?? null;
}

function setCachedEntry(key, entry) {
  cacheStore.set(key, entry);
}

function invalidateCacheEntry(key) {
  cacheStore.delete(key);
}

function normalizeRepository(repo) {
  return {
    name: repo?.name ?? "",
    author: repo?.author ?? "",
    url: repo?.url ?? "",
    description: repo?.description ?? null,
    language: repo?.language ?? null,
    languageColor: repo?.languageColor ?? null,
    stars: typeof repo?.stars === "number" ? repo.stars : 0,
    forks: typeof repo?.forks === "number" ? repo.forks : 0,
    currentPeriodStars:
      typeof repo?.currentPeriodStars === "number" ? repo.currentPeriodStars : 0,
    builtBy: Array.isArray(repo?.builtBy) ? repo.builtBy : [],
  };
}

async function requestTrendingRepositories(since, language, signal) {
  const params = new URLSearchParams({ since });
  if (language) params.set("language", language);

  const response = await fetch(`${TRENDING_API_BASE}?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const error = new Error(`Falha ao buscar trending repositories (HTTP ${response.status})`);
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Resposta inesperada da API de trending repositories");
  }

  return payload.map(normalizeRepository);
}

async function requestWithRetry(since, language, signal, retriesLeft, attempt = 0) {
  try {
    return await requestTrendingRepositories(since, language, signal);
  } catch (err) {
    if (signal.aborted || retriesLeft <= 0) throw err;
    const delay = DEFAULT_RETRY_DELAY * 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return requestWithRetry(since, language, signal, retriesLeft - 1, attempt + 1);
  }
}

function getOrCreateInFlightRequest(key, since, language, retryCount) {
  const existing = inFlightRequests.get(key);
  if (existing) return existing;

  const controller = new AbortController();
  const promise = requestWithRetry(since, language, controller.signal, retryCount)
    .then((data) => {
      inFlightRequests.delete(key);
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(key);
      throw err;
    });

  inFlightRequests.set(key, promise);
  return promise;
}

export function useGitHubTrending(options = {}) {
  const {
    since = "daily",
    language,
    cacheTTL = DEFAULT_CACHE_TTL,
    enabled = true,
    retryCount = DEFAULT_RETRY_COUNT,
  } = options;

  const cacheKey = buildCacheKey(since, language);

  const [repositories, setRepositories] = useState(() => getCachedEntry(cacheKey)?.data ?? []);
  const [isLoading, setIsLoading] = useState(() => !getCachedEntry(cacheKey));
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(() => {
    const cached = getCachedEntry(cacheKey);
    return cached ? Date.now() - cached.timestamp >= cacheTTL : false;
  });

  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const load = useCallback(
    async (opts = {}) => {
      const { force = false, silent = false } = opts;
      const currentRequestId = ++requestIdRef.current;

      const cached = getCachedEntry(cacheKey);
      const cacheIsFresh = cached ? Date.now() - cached.timestamp < cacheTTL : false;

      await Promise.resolve();
      if (!isMountedRef.current) return;

      if (cached) {
        setRepositories(cached.data);
        setIsStale(!cacheIsFresh);
        setIsLoading(false);
      }

      if (cacheIsFresh && !force) return;

      if (!silent) setIsLoading(cached === null);
      setIsValidating(true);
      setError(null);

      try {
        const data = await getOrCreateInFlightRequest(cacheKey, since, language, retryCount);
        if (!isMountedRef.current || currentRequestId !== requestIdRef.current) return;

        setCachedEntry(cacheKey, { data, timestamp: Date.now() });
        setRepositories(data);
        setIsStale(false);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current || currentRequestId !== requestIdRef.current) return;
        if (err?.name === "AbortError") return;
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar trending repositories"));
      } finally {
        if (isMountedRef.current && currentRequestId === requestIdRef.current) {
          setIsLoading(false);
          setIsValidating(false);
        }
      }
    },
    [cacheKey, cacheTTL, since, language, retryCount]
  );

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) load();
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, enabled]);

  const refetch = useCallback(async () => {
    invalidateCacheEntry(cacheKey);
    await load({ force: true });
  }, [cacheKey, load]);

  const mutate = useCallback(
    (updater) => {
      const cached = getCachedEntry(cacheKey);
      const nextData = typeof updater === "function" ? updater(cached?.data ?? []) : updater;
      setCachedEntry(cacheKey, { data: nextData, timestamp: Date.now() });
      setRepositories(nextData);
    },
    [cacheKey]
  );

  const clearCache = useCallback(() => {
    invalidateCacheEntry(cacheKey);
  }, [cacheKey]);

  return {
    repositories,
    isLoading,
    isValidating,
    error,
    isStale,
    refetch,
    mutate,
    clearCache,
  };
}