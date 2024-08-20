import { getNextWeekDates } from "./util/date.ts";
import { convertNHKFormat } from "./util/date.ts";
import { getNextDate, getNextWeekDate } from "./util/date.ts";
import {
  Config,
  SetNHKAPIRequest,
  SetNotificationRequest,
  SetProgramRequest,
} from "./schema.ts";

export const NHK_API_BASE_PATH = "https://api.nhk.or.jp/v2";
export const LINE_MESSAGING_API_BASE_PATH = "https://api.line.me/v2";

export class ExecuteType {
  public messageHeader: string;
  public timeArea: {
    beginTime: Date;
    endTime: Date;
  };
  public requestNHKDates: string[];

  constructor(type: "daily" | "weekly") {
    if (type === "daily") {
      this.messageHeader = "【日次】放送される番組の一覧です。\n\n";

      const nowDate = new Date();
      this.timeArea = {
        beginTime: nowDate,
        endTime: getNextDate(nowDate),
      };

      this.requestNHKDates = [
        convertNHKFormat(nowDate),
        convertNHKFormat(getNextDate(nowDate)),
      ];
    } else if (type === "weekly") {
      this.messageHeader = "【週次】放送される番組の一覧です。\n\n";

      const nowDate = new Date();
      this.timeArea = {
        beginTime: nowDate,
        endTime: getNextWeekDate(nowDate),
      };

      this.requestNHKDates = getNextWeekDates(nowDate).map((date) =>
        convertNHKFormat(date)
      );
    } else {
      throw new Error(`type: ${type}は存在しない。`);
    }
  }
}

/**
 * DenoKVに格納されている設定情報を読み込む
 * @param kv DenoKv
 * @returns nhk-connect-deno設定情報
 */
export async function loadConfig(kv: Deno.Kv) {
  const configPrograms = await kv.get<SetProgramRequest>([
    "config",
    "programs",
  ]);
  if (configPrograms.value == null) {
    throw new Error("failed to load config programs");
  }

  const configNHKAPI = await kv.get<SetNHKAPIRequest>(["config", "nhkapi"]);
  if (configNHKAPI.value == null) {
    throw new Error("failed to load config NHKAPI");
  }

  const configNotification = await kv.get<SetNotificationRequest>([
    "config",
    "notification",
  ]);
  if (configNotification.value == null) {
    throw new Error("failed to load config Notification");
  }

  const config: Config = {
    ...configPrograms.value,
    ...configNHKAPI.value,
    ...configNotification.value,
  };

  return config;
}
