import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const year = date.getFullYear();
  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");
  return `${formattedMonth}/${formattedDay}/${year}`;
};

export const formatTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getDateString = (deltaDay: number) => {
  const date = new Date();
  date.setDate(date.getDate() - deltaDay);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const convertDateString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const compactNumber = (value: number) => {
  if (value < 1000) {
    return value;
  } else if (value >= 1000 && value < 1_000_000) {
    return (value / 1000).toFixed(1) + "K";
  } else if (value >= 1_000_000 && value < 1_000_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  } else if (value >= 1_000_000_000 && value < 1_000_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B";
  } else if (value >= 1_000_000_000_000 && value < 1_000_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(1) + "T";
  } else {
    return value;
  }
};

export const POS = "#00C950";
export const NEG = "#FB2C36";
