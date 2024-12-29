import { assertEquals, assertRejects } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestDataMultipleFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/KvKey.ts";
import { ConfigRepository } from "./ConfigRepository.ts";
import { NotFoundConfigError } from "../common/exception.ts";

describe("ConfigRepository#get", () => {
  let kv: Deno.Kv;
  let repository: ConfigRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new ConfigRepository(kv);
    await setTestDataMultipleFromFile(kv, [
      {
        key: KV_KEYS.PROGRAMS,
        fileName: "testdata/config_programs.json",
      },
      {
        key: KV_KEYS.NHKAPI,
        fileName: "testdata/config_nhkapi.json",
      },
      {
        key: KV_KEYS.NOTIFICATION,
        fileName: "testdata/config_notification.json",
      },
    ]);
  });

  afterEach(() => {
    kv.close();
  });

  it("取得できる", async () => {
    const result = await repository.get();
    assertEquals(result, {
      "programs": [
        {
          "title": "100分de名著シリーズ",
        },
        {
          "title": "ザ・バックヤード",
        },
        {
          "title": "みんなのうた",
        },
      ],
      "area": "140",
      "services": [
        "g1",
        "e1",
      ],
      "nhkAPIKey": "nhk-api-key",
      "selectNow": "LINE",
      "LINEAPI": {
        "userID": "user-id",
        "accessToken": "access-token",
      },
    });
  });

  it("設定値のうち一部(NHKAPI)が欠損しているならば例外を送出する", async () => {
    await kv.delete(KV_KEYS.NHKAPI);

    await assertRejects(async () => {
      await repository.get();
    }, NotFoundConfigError);
  });
});
