import moment from 'moment';

export const formatValue = (value: number, digits: number = 0) => {
  return value.toLocaleString('pt-br', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export const formatMoney = (value: number) => {
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export const formatDateTime = (date: Date) => {
  return moment(date).format('DD/MM/yyyy HH:mm:ss');
}

export const formatDate = (date: Date) => {
  return moment(date).format('DD/MM/yyyy');
}

export const removeAccents = (text?: string) => {
  return (text ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};