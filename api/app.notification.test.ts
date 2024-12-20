import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestDataMultiple } from "../common/kv_test_helper.ts";
import { createApp } from "./app.ts";
import { EnvObject } from "../common/env.ts";

describe("notification", () => {
  let kv: Deno.Kv;
  const programsUrl = "http://localhost:8080/api/config/notification";
  const env: EnvObject = {
    basic: {
      user: "user",
      passwd: "passwd",
    },
    bearer: {
      token: "bearer_token",
    },
    kvPath: undefined,
    portNumber: 8080,
  };

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    await setTestDataMultiple(kv, [
      {
        key: ["config", "programs"],
        fileName: "testdata/config_programs.json",
      },
      {
        key: ["config", "nhkapi"],
        fileName: "testdata/config_nhkapi.json",
      },
      {
        key: ["config", "notification"],
        fileName: "testdata/config_notification.json",
      },
    ]);
  });

  afterEach(() => {
    kv.close();
  });

  it("GETできる", async () => {
    const app = createApp(env, kv);
    const res = await app.request(programsUrl, {
      headers: {
        authorization: `Bearer ${env.bearer.token}`,
      },
    });

    assertEquals(res.status, 200);
    assertEquals(await res.json(), {
      "selectNow": "LINE",
      "LINEAPI": {
        "userID": "user-id",
        "accessToken": "access-token",
      },
    });
  });

  it("POSTできGETすると値が変更されている", async () => {
    const app = createApp(env, kv);

    // POST
    const res = await app.request(programsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${env.bearer.token}`,
      },
      body: JSON.stringify({
        "selectNow": "LINE",
        "LINEAPI": {
          "userID": "changed-user-id",
          "accessToken": "access-token",
        },
      }),
    });

    assertEquals(res.status, 200);

    // GET
    const res2 = await app.request(programsUrl, {
      headers: {
        authorization: `Bearer ${env.bearer.token}`,
      },
    });

    assertEquals(res2.status, 200);
    assertEquals(await res2.json(), {
      "selectNow": "LINE",
      "LINEAPI": {
        "userID": "changed-user-id",
        "accessToken": "access-token",
      },
    });
  });
});
