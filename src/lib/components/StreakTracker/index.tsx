import { cn } from "@/lib/utils";
import { getDateArrayFromRange, getStandardWeekdays } from "./utils";
import { useCallback, useMemo } from "react";
import {
  AppTooltipProvider,
  AppTooltip,
  AppTooltipTrigger,
  AppTooltipContent,
} from "../ui/tooltip";

// BUGS:
// 1. Duplicate month labels ✅

// TODO:
// 1. Day labels on the left ✅
// 2. Better default overlay content (use day names) ✅
// 3. Year selector

/**
 * Visualize continuity of given date values (which can include time)
 */
export const StreakTracker: React.FC<{
  className?: string;
  values: Date[];
  onValueChange?: (newValue: Date[]) => void;

  onClick?: (value: Date) => void;
}> = (props) => {
  const start = useMemo(
    () => new Date(Math.min(...props.values.map((d) => d.getTime()))),
    [props.values],
  );
  // 365 days from start
  const end = useMemo(
    () => new Date(start.getTime() + 364 * 24 * 60 * 60 * 1000),
    [start],
  );

  const latest = new Date(Math.max(...props.values.map((d) => d.getTime())));
  const startYear = start.getFullYear();
  const endYear = latest.getFullYear();

  const doDatesMatch = useCallback(
    (date: Date) => {
      return props.values.some((d) => d.getTime() === date.getTime());
    },
    [props.values],
  );

  const boxValues = useMemo(() => {
    const values = getDateArrayFromRange({ start, end, step: "day" }).map(
      (date, i) => ({
        index: i,
        date,
        isFilled: doDatesMatch(date),
        isBlank: false,
      }),
    );

    // JS: Sunday=0 … Saturday=6
    const startDay = start.getDay();
    // how many blanks to prepend so first real date lands on Saturday
    const blanksNeeded = (startDay + 1) % 7;

    const backfill = Array.from({ length: blanksNeeded }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() - (blanksNeeded - i));
      return {
        index: -1 - i,
        date: d,
        isFilled: false,
        isBlank: true,
      };
    });

    return [...backfill, ...values];
  }, [doDatesMatch, end, start]);

  const weeks = useMemo(() => {
    const agg: (typeof boxValues)[] = [];

    for (let i = 0; i < boxValues.length; i += 7) {
      agg.push(boxValues.slice(i, i + 7));
    }

    return agg;
  }, [boxValues]);

  return (
    <div className={props.className}>
      <div className="flex flex-row gap-[3px] mb-2">
        <AppTooltipProvider delayDuration={1000}>
          {/* Day labels on the left */}
          <div className="flex flex-col gap-[3px] mt-2">
            {getStandardWeekdays().map((day, i) => (
              <div
                key={`weekday-label-${i}`}
                className="h-[12px] text-xs leading-0 flex items-center text-muted-foreground"
              >
                {i !== 0 && i % 2 === 0 && <>{day}</>}
              </div>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex flex-col gap-[3px]">
              {/* Month label*/}
              <div className="text-xs text-muted-foreground h-[20px] w-0">
                {week.some(
                  (box) =>
                    box.date.toLocaleString("default", {
                      day: "numeric",
                    }) === "1",
                ) && (
                  <>
                    {week[week.length - 1].date?.toLocaleString("default", {
                      month: "short",
                    })}
                  </>
                )}
              </div>

              {/* Box columns */}
              {week.map((box) => (
                <div 
                  key={`box-column-${box.date}`}
                  className="flex items-center justify-end gap-3">
                  {!box.isBlank && box.date !== null && (
                    <AppTooltip key={`box--${box.date}-${box.index}`}>
                      <AppTooltipTrigger>
                        <EntryBox
                          isFilled={box.isFilled}
                          showNumber={false}
                          number={box.index}
                          onClick={() => props.onClick?.(box.date)}
                        />
                      </AppTooltipTrigger>

                      <AppTooltipContent>
                        <span className="mr-1">
                          {box.date.toLocaleString("default", {
                            month: "long",
                          })}
                        </span>

                        <span>
                          {box.date.toLocaleString("default", {
                            day: "numeric",
                          })}
                        </span>
                      </AppTooltipContent>
                    </AppTooltip>
                  )}

                  {box.date === null ||
                    (box.isBlank && <div className="w-[12px] h-[12px]" />)}
                </div>
              ))}
            </div>
          ))}
        </AppTooltipProvider>
      </div>

      <div className="text-muted-foreground text-sm text-center">
        {startYear === endYear && <>{startYear}</>}

        {startYear !== endYear && (
          <>
            {startYear} {`->`} {endYear}
            <br />
            (some values are hidden)
          </>
        )}
      </div>
    </div>
  );
};

const EntryBox: React.FC<{
  className?: string;
  isFilled?: boolean;

  // TODO: remove later
  showNumber?: boolean;
  number?: number;

  onClick?: () => void;

  hoverComponentChildren?: React.ReactNode;
}> = (props) => {
  return (
    <div
      className={cn(
        "h-[12px] w-[12px] rounded-[3px] bg-neutral-900 border cursor-pointer",
        !props.isFilled && "hover:bg-neutral-600 border-neutral-800/50",
        props.isFilled && "bg-green-700 hover:bg-green-300",
        props.className,
      )}
      onClick={props.onClick}
    >
      {/* TODO: remove later */}
      {props.showNumber ? (
        <span className="flex items-center text-center justify-center text-[6.5px] font-mono rotate-30 font-bold text-neutral-700">
          {props.number}
        </span>
      ) : undefined}
    </div>
  );
};
