import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestDataFromFile } from "./kv_test_helper.ts";
import { KV_KEYS } from "./KvKey.ts";
import { NhkApiRepository } from "./NhkApiRepository.ts";

describe("NhkApiRepository#get", () => {
  let kv: Deno.Kv;
  let repository: NhkApiRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new NhkApiRepository(kv);
    await setTestDataFromFile(
      kv,
      KV_KEYS.NHKAPI,
      "testdata/config_nhkapi.json",
    );
  });

  afterEach(() => {
    kv.close();
  });

  it("取得できる", async () => {
    const result = await repository.get();
    assertEquals(result, {
      "area": "140",
      "services": [
        "g1",
        "e1",
      ],
      "nhkAPIKey": "nhk-api-key",
    });
  });

  it("取得できない場合はnullを返す", async () => {
    await kv.delete(KV_KEYS.NHKAPI);
    const result = await repository.get();
    assertEquals(result, null);
  });
});

describe("NhkApiRepository#save", () => {
  let kv: Deno.Kv;
  let repository: NhkApiRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new NhkApiRepository(kv);
  });

  afterEach(() => {
    kv.close();
  });

  it("保存できる", async () => {
    await repository.save({
      "area": "110",
      "services": [
        "g1",
      ],
      "nhkAPIKey": "nhk-api-key-sample",
    });

    const result = await kv.get(KV_KEYS.NHKAPI);
    assertEquals(result.value, {
      "area": "110",
      "services": [
        "g1",
      ],
      "nhkAPIKey": "nhk-api-key-sample",
    });
  });
});
