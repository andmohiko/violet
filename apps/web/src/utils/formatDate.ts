// timestamp型の日付とDate型の日付を日本時間の文字列に変換する関数

export const formatDate = (date?: { toDate?: () => Date } | Date | string) => {
  if (!date) return '-';
  if (
    typeof date === 'object' &&
    date !== null &&
    'toDate' in date &&
    typeof date.toDate === 'function'
  ) {
    // Timestamp型
    return date.toDate().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  }
  if (date instanceof Date) {
    // Date型
    return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  }
};
