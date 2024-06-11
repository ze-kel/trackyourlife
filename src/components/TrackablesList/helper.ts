import { getDaysInMonth } from "date-fns";
import type { ITrackableFromList } from "src/app/api/trackables/apiFunctions";

export const generateDates = (days: number, nowDate: Date) => {
  const today = nowDate;

  let year = today.getFullYear();
  let month = today.getMonth();
  let day = today.getDate();

  const dates: { year: number; month: number; day: number }[] = [];

  for (; days >= 1; days--) {
    dates[days] = { year, month, day };

    if (day === 1) {
      if (month === 0) {
        year--;
        month = 11;
      } else {
        month--;
      }
      day = getDaysInMonth(new Date(year, month));
    } else {
      day--;
    }
  }
  return dates;
};

export const sortTrackableList = (
  list: ITrackableFromList[],
  favorites: string[],
) => {
  const favSet = new Set(favorites);

  const newList = list.sort((a, b) => {
    if (favSet.has(a.id) && !favSet.has(b.id)) return -1;
    if (!favSet.has(a.id) && favSet.has(b.id)) return 1;

    const aName = a.name || "";
    const bName = b.name || "";

    return aName.localeCompare(bName);
  });

  return newList;
};
