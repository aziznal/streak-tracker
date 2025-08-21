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
