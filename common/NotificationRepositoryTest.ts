import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestDataFromFile } from "./kv_test_helper.ts";
import { KV_KEYS } from "./KvKey.ts";
import { NotificationRepository } from "./NotificationRepository.ts";

describe("NotificationRepository#get", () => {
  let kv: Deno.Kv;
  let repository: NotificationRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new NotificationRepository(kv);
    await setTestDataFromFile(
      kv,
      KV_KEYS.NOTIFICATION,
      "testdata/config_notification.json",
    );
  });

  afterEach(() => {
    kv.close();
  });

  it("取得できる", async () => {
    const result = await repository.get();
    assertEquals(result, {
      "selectNow": "LINE",
      "LINEAPI": {
        "userID": "user-id",
        "accessToken": "access-token",
      },
    });
  });

  it("取得できない場合はnullを返す", async () => {
    await kv.delete(KV_KEYS.NOTIFICATION);
    const result = await repository.get();
    assertEquals(result, null);
  });
});

describe("NotificationRepository#save", () => {
  let kv: Deno.Kv;
  let repository: NotificationRepository;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new NotificationRepository(kv);
  });

  afterEach(() => {
    kv.close();
  });

  it("保存できる", async () => {
    await repository.save({
      "selectNow": "LINE",
      "LINEAPI": {
        "userID": "user-id2",
        "accessToken": "access-token2",
      },
    });

    const result = await kv.get(KV_KEYS.NOTIFICATION);
    assertEquals(result.value, {
      "selectNow": "LINE",
      "LINEAPI": {
        "userID": "user-id2",
        "accessToken": "access-token2",
      },
    });
  });
});
