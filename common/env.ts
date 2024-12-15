export type EnvObject = {
  basic: {
    user: string;
    passwd: string;
  };
  bearer: {
    token: string;
  };
  kvPath: string | undefined;
  portNumber: number;
};

/** 環境変数からアプリケーションに使用する値を取得 */
export function getEnvObject(): EnvObject {
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
    portNumber: Number(getEnv("PORT")),
  };
}

/**
 * @param key 環境変数のKey
 * @throws {Error} KeyにValueがセットされていないときThrow
 * @returns 環境変数のValue
 */
export function getEnv(key: string) {
  const value = Deno.env.get(key);
  if (value == null) {
    throw new Error(`envに${key}がセットされていません`);
  }
  return value;
}
