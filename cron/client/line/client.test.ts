import { LinePushRequest } from "../../types.ts";
import { sendLINEMessage } from "./client.ts";

Deno.test({
  name: "actual invalid",
  permissions: { net: true },
  ignore: true,
}, async () => {
  console.log("Hello World");
  const param: LinePushRequest = {
    userID: "invalid",
    accessToken: "invalid",
    message: "invalid",
  };

  await sendLINEMessage(param);
});

Deno.test({
  name: "actual valid",
  permissions: { net: true },
  ignore: true,
}, async () => {
  console.log("Hello World");
  const param: LinePushRequest = {
    userID: "xxx",
    accessToken: "xxx",
    message: "xxx",
  };

  await sendLINEMessage(param);
});
