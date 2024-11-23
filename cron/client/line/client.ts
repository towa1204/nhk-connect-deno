import { LINE_MESSAGING_API_BASE_PATH } from "../../config.ts";
import { convertJSTMMDDhhmmFormat } from "../../util/date.ts";
import { LinePushRequest, WatchProgram } from "../../types.ts";
import { APIClientStatusException } from "../exception.ts";

/**
 * LINE Messaging Push API
 *
 * ドキュメント: https://developers.line.biz/ja/reference/messaging-api/
 * @throws APIClientStatusException
 */
export async function sendLINEMessage(
  { userID, accessToken, message }: LinePushRequest,
) {
  const payload = {
    to: userID,
    messages: [{
      type: "text",
      text: message,
    }],
  };

  const url = `${LINE_MESSAGING_API_BASE_PATH}/bot/message/push`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new APIClientStatusException({
      status: res.status,
      summary: "LINE Messaging Push APIへの接続に失敗",
      detail: await res.text(),
    });
  }

  await res.body?.cancel();
}

export function createLINEMessage(
  messageHeader: string,
  programs: WatchProgram[],
): string {
  const programsMessage = programs.map((program, index) => {
    const startMMDDhhmm = convertJSTMMDDhhmmFormat(program.start_time);
    const endMMDDhhmm = convertJSTMMDDhhmmFormat(program.end_time);
    return [
      `[${index + 1}] ${startMMDDhhmm} ~ ${endMMDDhhmm}`,
      `${program.title}`,
    ].join("\n");
  }).join("\n\n");

  return messageHeader + programsMessage;
}
