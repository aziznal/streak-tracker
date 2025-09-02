export function getDateArrayFromRange(args: {
  start: Date;
  end: Date;
  step: "day";
}): Date[] {
  if (args.step !== "day") return [];

  const result: Date[] = [];
  const current = new Date(args.start);

  while (current <= args.end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/** Returns localized list of weekdays */
export function getStandardWeekdays() {
  const base = new Date(2025, 0, 4); // this is a Saturday

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toLocaleString("default", { weekday: "short" });
  });
}

export function isSpanningMultipleYears(dates: Date[]) {
  return new Set(dates.map((date) => date.getFullYear())).size > 1;
}
