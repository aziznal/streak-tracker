import { cn } from "@/lib/utils";
import { getDateArrayFromRange } from "./utils";

// ideas for features:
// - resolution: decide whether it counts by days vs hours / weeks / months etc.
// - onhover component overlay as prop
// - parameterize row count

/**
 * Visualize continuity of given date values (which can include time)
 */
export const StreakTracker: React.FC<{
  className?: string;
  values: Date[];
  onValueChange?: (newValue: Date[]) => void;
}> = (props) => {
  const shouldFill = (date: Date) => {
    return props.values.includes(date);
  };

  const start = props.values[0];
  const end = props.values[props.values.length - 1];
  const steps = 12;

  const boxValues = getDateArrayFromRange({ start, end, step: "day" }).map(
    (date, i) => ({
      index: i,
      isFilled: shouldFill(date),
    }),
  );

  return (
    <div>
      <div
        className={cn(
          props.className,
          "flex flex-col gap-[3px] flex-wrap max-h-[120px]",
        )}
      >
        {boxValues.map((box) => (
          <EntryBox
            key={box.index}
            isFilled={box.isFilled}
            showNumber={false}
            number={box.index}
          />
        ))}
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
}> = (props) => {
  return (
    <div
      className={cn(
        props.className,
        "h-[12px] w-[12px] rounded bg-neutral-900",
        props.isFilled && "bg-green-500",
      )}
      // TODO: remove later
      children={
        props.showNumber ? (
          <span className="flex items-center text-center justify-center text-[6.5px] font-mono rotate-30 font-bold text-neutral-700">
            {props.number}
          </span>
        ) : undefined
      }
    />
  );
};
