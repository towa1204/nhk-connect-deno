import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestData } from "./kv_test_helper.ts";
import { setTestDataMultiple } from "./kv_test_helper.ts";

const testData = {
  path: "testdata/helper/valid_user.json",
  expected: {
    "username": "taro",
    "age": 100,
    "like": [
      "soccer",
      "programming",
    ],
  },
};

describe("setTestData", () => {
  let kv: Deno.Kv;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
  });

  afterEach(() => {
    kv.close();
  });

  it("1件セットできる", async () => {
    await setTestData(kv, ["user"], testData.path);

    const result = await kv.get(["user"]);
    assertEquals(result.value, testData.expected);
  });
});

describe("setTestDataMultiple", () => {
  let kv: Deno.Kv;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
  });

  afterEach(() => {
    kv.close();
  });

  it("1件セットできる", async () => {
    await setTestDataMultiple(kv, [{
      key: ["user"],
      fileName: testData.path,
    }]);

    const result = await kv.get(["user"]);
    assertEquals(result.value, testData.expected);
  });

  it("複数件セットできる", async () => {
    await setTestDataMultiple(kv, [
      {
        key: ["user"],
        fileName: testData.path,
      },
      {
        key: ["user", "taro"],
        fileName: testData.path,
      },
    ]);

    const result = await kv.get(["user"]);
    assertEquals(result.value, testData.expected);

    const result2 = await kv.get(["user", "taro"]);
    assertEquals(result2.value, testData.expected);
  });
});
