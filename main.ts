import "https://deno.land/std@0.223.0/dotenv/load.ts";
import secrets from "./secrets.json" with { type: "json" };
import { NotifyRequest, ProgramListReq } from "./types.ts";
import { fetchProgramList } from "./api/nhk_client.ts";
import { convertNHKDateFormat } from "./date.ts";

// Deno.cronから呼び出す想定
await notifyDaily();

async function notifyDaily() {
  /**
   * 0. secrets.jsonから設定情報を取得
   */
  const broadcastArea = secrets.area;
  const broadcastServices = secrets.services;
  const NHKAPIKey = secrets.nhkAPIKey;
  const programKeywords = secrets.subscribePrograms.map((program) =>
    program.keyword
  );

  /**
   * 1. 番組情報の取得
   * Serviceの数だけリクエストを実施
   */
  const nowNHKDateFormat = convertNHKDateFormat(new Date());
  for (const broadcastService of broadcastServices) {
    const serviceProgramList = await fetchProgramList({
      area: broadcastArea,
      service: broadcastService,
      date: nowNHKDateFormat,
      apikey: NHKAPIKey,
    });
    console.log(serviceProgramList);
  }

  /**
   * 2. 視聴番組情報の取得
   * 番組情報から「視聴番組」かつ「実行日時から24時間以内に放映される番組」を抜き出す
   */

  /**
   * 3. 通知
   * APIを使用して放送情報を通知する
   * 通知アプリによらないインタフェースにする
   */
  //
}

// function notifyWeekly() {
// }
