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
 * DateオブジェクトをYYYY-MM-DDに変換する
 * @param date Dateオブジェクト
 * @returns YYYY-MM-DD
 */
export function convertNHKDate(date: Date) {
  const formattedDate = date
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .join("-");
  return formattedDate;
}
