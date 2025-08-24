import { cn } from "@/lib/utils";
import { getDateArrayFromRange } from "./utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useMemo } from "react";

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

  const boxValues = useMemo(
    () =>
      getDateArrayFromRange({ start, end, step: "day" }).map((date, i) => ({
        index: i,
        date,
        isFilled: doDatesMatch(date),
      })),
    [doDatesMatch, end, start],
  );

  const weeks = useMemo(() => {
    const agg: (typeof boxValues)[] = [];

    for (let i = 0; i < boxValues.length; i += 7) {
      agg.push(boxValues.slice(i, i + 7));
    }

    return agg;
  }, [boxValues]);

  return (
    <div>
      <div className="flex flex-row gap-[3px] mb-2">
        <TooltipProvider delayDuration={1000}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              <div className="text-sm text-muted-foreground h-[20px] w-0">
                {weekIndex % 4 === 0 && (
                  <>
                    {week[week.length - 1].date.toLocaleString("default", {
                      month: "short",
                    })}
                  </>
                )}
              </div>

              {week.map((box) => (
                <Tooltip key={box.index}>
                  <TooltipTrigger>
                    <EntryBox
                      isFilled={box.isFilled}
                      showNumber={false}
                      number={box.index}
                      onClick={() => props.onClick?.(box.date)}
                    />
                  </TooltipTrigger>

                  <TooltipContent>{box.date.toLocaleString()}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </TooltipProvider>
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
        "h-[12px] w-[12px] rounded bg-neutral-900 cursor-pointer",
        !props.isFilled && "hover:bg-neutral-700",
        props.isFilled && "bg-green-500 hover:bg-green-300",
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
