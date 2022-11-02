import {
  add,
  formatDistanceToNow,
  intlFormatDistance,
  isAfter,
  isSameDay,
  isToday as _isToday,
  parse,
} from "date-fns";

export function getPrevious7Days(now = new Date()) {
  return new Array(7).fill(0).map((e, days) => add(now, { days: -days }));
}

export function sortSundayFirst(dates = getPrevious7Days()) {
  throw new Error();
  return dates.sort((a, b) => a.getDay() - b.getDay());
}

export function isToday(date) {
  return _isToday(date);
}

export function getWeekOffsetFromToday(
  date = new Date(),
  dif = new Date().getDay()
) {
  return add(date, { days: -date.getDay() + dif });
}

export function convertDateArrayToOnlyFirstDays(arr = [new Date()]) {
  return Array.from(
    arr.reduce((newArr, date) => {
      newArr.add(
        getWeekOffsetFromToday(new Date(date)).toLocaleDateString("en-GB")
      );
      return newArr;
    }, new Set())
  ).map((datestring) => parseDate(datestring));
}

export function getTimePassedSinceNow(date = add(new Date(), { days: -1 })) {
  const timeAsEnglish = ` (${intlFormatDistance(date, new Date())})`;
  if (timeAsEnglish.includes("week")) return timeAsEnglish;
  return " (today)";
}

export function getSelectedDates(selectedDays = [], firstDatesOfWeek = []) {
  return selectedDays.flatMap((days) => {
    return firstDatesOfWeek.map(({ value }) => {
      return add(value, { days: 6 - days });
    });
  });
}

export function doDatesMatch(baseDate, dates = []) {
  const matches = dates.some((e) => isSameDay(e, baseDate));
  return matches;
}

export function parseDate(datestring) {
  return parse(datestring, "dd/MM/yyyy", new Date());
}

export function dateRangeLabel(date = new Date(), range = 7) {
  return (
    date.toLocaleDateString("en-GB") +
    "-" +
    add(date, { days: range }).toLocaleDateString("en-GB")
  );
}
