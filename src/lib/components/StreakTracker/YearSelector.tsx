import { cn } from "@/lib/utils";
import { useId, useMemo } from "react";

export const StreakTrackerYearSelector: React.FC<{
  className?: string;
  dates: Date[];

  /** selected year */
  value: number;
  onValueChange: (newValue: number) => void;
}> = (props) => {
  const years = useMemo(() => {
    const unique = Array.from(
      new Set(props.dates.map((value) => value.getFullYear())),
    ).toSorted();

    const min = Math.min(...unique);
    const max = Math.max(...unique);

    return Array.from({ length: max - min + 1 }, (_, i) => {
      return min + i;
    }).toReversed();
  }, [props.dates]);

  const id = useId();

  return (
    <ol className={cn(props.className)}>
      {years.map((year) => (
        <li
          key={`${id}-year-${year}`}
          onClick={() => props.onValueChange(year)}
          className={cn(
            "px-2 py-1.5 rounded-md w-fit select-none text-sm transition-colors duration-75",
            year !== props.value && "hover:bg-neutral-800 cursor-pointer",
            year === props.value && "bg-neutral-800 font-bold",
          )}
        >
          {year}
        </li>
      ))}
    </ol>
  );
};
