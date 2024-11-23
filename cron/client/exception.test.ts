import {
  APIClientStatusException,
  APIClientStatusExceptionOptions,
} from "./exception.ts";
import { assertEquals } from "@std/assert";

Deno.test("has status property", () => {
  // throw new BaseError({ message: "waiwai", cause: new Error("error") });
  const status = 401;
  const e = new APIClientStatusException({ status });
  console.log(e.message);
  assertEquals(e.status, status);
  assertEquals(e.summary, undefined);
  assertEquals(e.detail, undefined);
  assertEquals(e.cause, undefined);
});

Deno.test("has all property", () => {
  const options: APIClientStatusExceptionOptions = {
    status: 500,
    summary: "hoge API でエラー",
    detail: `{code: 344, message: "INTERNAL SERVER ERROR"}`,
    cause: undefined,
  };
  const e = new APIClientStatusException(options);
  console.log(e.message);
  assertEquals(e.status, options.status);
  assertEquals(e.summary, options.summary);
  assertEquals(e.detail, options.detail);
  assertEquals(e.cause, options.cause);
});
