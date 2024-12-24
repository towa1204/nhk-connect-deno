import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestDataFromFile } from "./kv_test_helper.ts";
import { ProgramsRepository } from "./ProgramsRepository.ts";
import { KV_KEYS } from "./KvKey.ts";

describe("ProgramsRepository#get", () => {
  let kv: Deno.Kv;
  let repository: ProgramsRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new ProgramsRepository(kv);
    await setTestDataFromFile(
      kv,
      KV_KEYS.PROGRAMS,
      "testdata/config_programs.json",
    );
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
    });
  });

  it("取得できない場合はnullを返す", async () => {
    await kv.delete(KV_KEYS.PROGRAMS);
    const result = await repository.get();
    assertEquals(result, null);
  });
});

describe("ProgramsRepository#save", () => {
  let kv: Deno.Kv;
  let repository: ProgramsRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new ProgramsRepository(kv);
  });

  afterEach(() => {
    kv.close();
  });

  it("保存できる", async () => {
    await repository.save({
      "programs": [
        {
          "title": "ブラタモリ",
        },
      ],
    });

    const result = await kv.get(KV_KEYS.PROGRAMS);
    assertEquals(result.value, {
      "programs": [
        {
          "title": "ブラタモリ",
        },
      ],
    });
  });
});
