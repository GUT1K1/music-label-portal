interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000;

  async fetch<T>(
    url: string, 
    options?: RequestInit,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cacheKey = `${url}_${JSON.stringify(options || {})}`;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
      return cached.data;
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: now });

    return data;
  }

  invalidate(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp >= this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T, ttl?: number) {
    this.cache.set(key, { 
      data, 
      timestamp: Date.now() 
    });
  }
}

export const apiCache = new APICache();
