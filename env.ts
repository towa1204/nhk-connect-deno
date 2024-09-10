export type Env = {
  Variables: {
    kv: Deno.Kv;
  };
};

export function getEnvObject() {
  let kvPath = Deno.env.get("KV_PATH");
  if (kvPath === "") kvPath = undefined;

  return {
    basic: {
      user: getEnv("USERNAME"),
      passwd: getEnv("PASSWD"),
    },
    bearer: {
      token: getEnv("BEARER_TOKEN"),
    },
    kvPath: kvPath,
  };
}

export function getEnv(key: string) {
  const value = Deno.env.get(key);
  if (value == null) {
    throw new Error(`envに${key}がセットされていません`);
  }
  return value;
}
