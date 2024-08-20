import "@std/dotenv/load";

export function getEnv(key: string) {
  const value = Deno.env.get(key);
  if (value == null) {
    throw new Error(`envに${key}がセットされていません`);
  }
  return value;
}
