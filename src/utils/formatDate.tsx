import dayjs from 'dayjs';

export const stringDateSplit = (dateStr: string, part: 'year' | 'month' | 'day') => {
  const date = dayjs(dateStr);
  switch (part) {
    case 'year':
      return date.year();
    case 'month':
      return date.month() + 1;
    case 'day':
      return date.date();
    default:
      return;
  }
};

export const formatYYYYMMDD = (date?: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};
