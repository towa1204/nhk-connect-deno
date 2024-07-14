import { LINE_MESSAGING_API_BASE_PATH } from "../config.ts";
import { convertJSTMMDDhhmmFormat } from "../date.ts";
import { LinePushRequest, WatchProgram } from "../types.ts";

/**
 * LINE Messaging Push API
 * 仕様は下記リンク参照
 * ・https://developers.line.biz/ja/reference/messaging-api/
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
  const res = await fetch(`${LINE_MESSAGING_API_BASE_PATH}/bot/message/push`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorMessage = [
      `LINE Messaging Push APIへの接続に失敗しました。`,
      `ステータスコード: ${res.status}`,
      `メッセージ: ${await res.text()}`,
    ].join("\n");
    throw new Error(errorMessage);
  }
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
