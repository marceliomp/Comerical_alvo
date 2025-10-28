declare module "memory-cache" {
  type ValueType = any;

  interface Cache {
    put<T = ValueType>(key: string, value: T, time?: number, timeoutCallback?: () => void): T;
    get<T = ValueType>(key: string): T | null;
    del(key: string): void;
    clear(): void;
    size(): number;
  }

  const cache: Cache;
  export default cache;
}
