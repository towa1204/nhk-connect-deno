// 与えられたDateオブジェクトの次の日のDateオブジェクトを返す
export function getNextDate(date: Date) {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);
  return nextDate;
}

// 与えられたDateオブジェクトの日付から1週間分の日付のDateオブジェクトの配列を返す
export function getWeekDates(date: Date) {
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(date);
    date = getNextDate(date);
  }
  return weekDates;
}

/**
 * DateオブジェクトをJSTのYYYY-MM-DDに変換する
 * @param date Dateオブジェクト
 * @returns YYYY-MM-DD
 */
export function convertNHKFormat(dateObject: Date) {
  const { year, month, date } = getJSTDateParts(dateObject);
  return `${year}-${month}-${date}`;
}

/**
 * DateオブジェクトをJSTに変換したうえで各日時ごとに取得する
 * @param rawDate JSTに変換したいDateオブジェクト
 * @returns JSTの{年,月,日,時,分,秒}
 */
export function getJSTDateParts(dateObject: Date) {
  // 日本時間（JST）に変換
  // UTC+9時間を加算

  // ローカルタイムをUTCタイムスタンプに変換
  const utcTimestamp = dateObject.getTime();
  // 9時間をミリ秒に変換
  const jstOffset = 9 * 60 * 60 * 1000;

  const jstTimestamp = utcTimestamp + jstOffset;
  const jstDate = new Date(jstTimestamp);

  return {
    "year": jstDate.getUTCFullYear(),
    "month": ("0" + (jstDate.getUTCMonth() + 1)).slice(-2), // 月は0から始まるため1を加算
    "date": ("0" + jstDate.getUTCDate()).slice(-2),
    "hours": ("0" + jstDate.getUTCHours()).slice(-2),
    "minutes": ("0" + jstDate.getUTCMinutes()).slice(-2),
    "seconds": ("0" + jstDate.getUTCSeconds()).slice(-2),
  };
}

/**
 * ISO8601拡張形式の日付をJSTの MM/DD hh:mm 形式に変換する
 * @param iso8601extDate ISO8601拡張形式に日付文字列
 */
export function convertJSTMMDDhhmmFormat(iso8601extDate: string) {
  const { month, date, hours, minutes } = getJSTDateParts(
    new Date(iso8601extDate),
  );
  return `${month}/${date} ${hours}:${minutes}`;
}
