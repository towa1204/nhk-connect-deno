export interface Repository<T> {
  get: () => Promise<T | null>;
  save: (value: T) => void;
}
