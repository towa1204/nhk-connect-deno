import { Config } from "../api/schema.ts";

export interface Repository<T> {
  get: () => Promise<T | null>;
  save: (value: T) => void;
}

export interface IConfigRepository {
  get: () => Promise<Config | null>;
}