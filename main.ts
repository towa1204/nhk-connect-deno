import "https://deno.land/std@0.223.0/dotenv/load.ts";
import secrets from "./secrets.json" with { type: "json" };
import { Program, WatchProgram } from "./types.ts";
import { fetchProgramList } from "./api/nhk_client.ts";
import { convertNHKFormat } from "./date.ts";
import { getNextDate } from "./date.ts";
import { convertJSTMMDDhhmmFormat } from "./date.ts";

// Deno.cronから呼び出す想定
await notifyDaily();

/**
 * 視聴番組日次通知
 */
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
   * 1. 番組情報の取得(2日分)
   * Serviceの数だけリクエストを実施
   */
  const nowDate = new Date();
  const tommrowNowDate = getNextDate(nowDate);

  const nowNHKFormat = convertNHKFormat(nowDate);
  const tommrowNowNHKFormat = convertNHKFormat(tommrowNowDate);

  const programs: Program[] = [];
  for (const dateNHKFormat of [nowNHKFormat, tommrowNowNHKFormat]) {
    for (const broadcastService of broadcastServices) {
      const serviceProgramList = await fetchProgramList({
        area: broadcastArea,
        service: broadcastService,
        date: dateNHKFormat,
        apikey: NHKAPIKey,
      });
      programs.push(...serviceProgramList.list[broadcastService]);
    }
  }
  console.log(programs.length);

  /**
   * 2. 視聴番組情報の取得
   */
  const watchPrograms: WatchProgram[] =
    // 番組情報から「視聴番組」かつ「実行日時から24時間以内に放映される番組」を抜き出す
    programs.filter((program) => {
      // 「視聴番組」かチェック
      const isWatchProgram = programKeywords.some((keyword) =>
        program.title.includes(keyword)
      );

      // 「実行日時から24時間以内に放映される番組」かチェック
      const programStartDate = new Date(program.start_time);
      const isBroadcastWithin24Hours = programStartDate >= nowDate &&
        programStartDate < tommrowNowDate;

      return isWatchProgram && isBroadcastWithin24Hours;
    })
      // 欲しい形に番組情報を整形する
      .map((program) => {
        return {
          "title": program.title,
          "subtitle": program.subtitle,
          "content": program.content,
          "act": program.act,
          "genres": program.genres,
          "start_time": program.start_time,
          "end_time": program.end_time,
        };
      });
  console.log(watchPrograms);

  /**
   * 3. 通知用メッセージの作成
   */
  const programsMessage = watchPrograms.map((watchProgram, index) => {
    const startMMDDhhmm = convertJSTMMDDhhmmFormat(watchProgram.start_time);
    const endMMDDhhmm = convertJSTMMDDhhmmFormat(watchProgram.end_time);
    return [
      `[${index + 1}] ${startMMDDhhmm} ~ ${endMMDDhhmm}`,
      `${watchProgram.title}`,
    ].join("\n");
  }).join("\n\n");

  const notifyMessage = "放送される番組の一覧です。\n\n" + programsMessage;

  /**
   * 4. 通知
   * APIを使用して放送情報を通知する
   * 通知アプリによらないインタフェースにする
   */
  console.log(notifyMessage);
}

// function notifyWeekly() {
// }
