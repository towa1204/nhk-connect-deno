import { fetchProgramList } from "./client.ts";
import { ProgramListReq } from "../../types.ts";

Deno.test({
  name: "actual invalid",
  permissions: { net: true },
  ignore: true,
}, async () => {
  const param: ProgramListReq = {
    area: "140",
    service: "g1",
    date: "2024-11-24",
    apikey: "invalid",
  };

  await fetchProgramList(param);
});

Deno.test({
  name: "actual valid",
  permissions: { net: true },
  ignore: true,
}, async () => {
  const param: ProgramListReq = {
    area: "140",
    service: "g1",
    date: "2024-11-24",
    apikey: "xxx",
  };

  const res = await fetchProgramList(param);
  console.log(res);
});
