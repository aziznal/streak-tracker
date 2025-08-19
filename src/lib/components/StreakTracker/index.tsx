import { cn } from "@/lib/utils";

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
  const totalCount = 365;

  const shouldFill = (date: Date) => {
    return Math.random() > 0.8;
  };

  const boxValues = Array(totalCount)
    .fill(0)
    .map((_, i) => ({
      index: i,
      isFilled: shouldFill(props.values[i]),
    }));

  return (
    <div
      className={cn(
        props.className,
        "flex flex-col gap-[3px] flex-wrap max-h-[120px]",
      )}
    >
      {boxValues.map((box) => (
        <EntryBox
          isFilled={box.isFilled}
          showNumber={false}
          number={box.index}
        />
      ))}
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
