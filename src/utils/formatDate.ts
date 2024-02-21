import dayjs from 'dayjs';

export type DateType =
  | 'DD/MMM/YYYY'
  | 'DD/MM/YYYY'
  | 'DD/MM/YYYY HH:mm'
  | 'DD/MM/YYYY HH:mm:ss';

export const formatDate = (date: Date, type: DateType) => {
  return dayjs(date).format(type);
};
