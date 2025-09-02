import {
  StreakTracker,
  StreakTrackerYearSelector,
} from "@/lib/components/StreakTracker";
import { getDateArrayFromRange } from "@/lib/components/StreakTracker/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
  ssr: false,
});

function App() {
  const [values, setValues] = useState<Date[]>(
    getDateArrayFromRange({
      start: new Date("2025-01-01T00:00:00Z"),
      end: new Date("2025-12-31T23:59:59Z"),
      step: "day",
    }).filter(() => Math.random() > 0.5),
  );

  const toggleValue = (value: Date) => {
    setValues((prev) => {
      const ts = value.getTime();
      const exists = prev.some((date) => date.getTime() === ts);

      return exists
        ? prev.filter((date) => date.getTime() !== ts)
        : [...prev, value];
    });
  };

  const aug01_dec01_values = getDateArrayFromRange({
    start: new Date("2025-08-01T00:00:00Z"),
    end: new Date("2025-12-01T00:00:00Z"),
    step: "day",
  });

  const scatteredDays = [
    new Date("2024-08-01T00:00:00Z"),
    new Date("2024-09-06T00:00:00Z"),
    new Date("2025-03-06T00:00:00Z"),
    new Date("2026-07-25T00:00:00Z"),
    new Date("2029-07-25T00:00:00Z"),
  ];
  const [selectedYear, setSelectedYear] = useState(2024);

  return (
    <div className="min-h-dvh flex items-center flex-col mt-12">
      <h1 className="text-center text-3xl font-black mb-8">Streak Tracker</h1>

      <div className="flex flex-col gap-8 mb-24 w-full max-w-fit">
        <section>
          <div className="text-muted-foreground mb-2 text-sm italic">
            01 Jan 2025 to 31 Dec 2025 (exactly 1 year) - Try clicking values!
          </div>

          <div className="border p-4 rounded-lg overflow-x-auto">
            <StreakTracker values={values} onClick={toggleValue} />
          </div>
        </section>

        <section>
          <div className="text-muted-foreground mb-2 text-sm italic">
            01 August 2025 to 01 December 2025 (3 months)
          </div>

          <div className="border p-4 rounded-lg overflow-x-auto">
            <StreakTracker values={aug01_dec01_values} />
          </div>
        </section>

        <section>
          <div className="text-muted-foreground mb-2 text-sm italic">
            Scattered days (spanning 5 years)
          </div>

          <div className="border p-4 rounded-lg overflow-x-auto flex gap-4">
            <StreakTracker
              values={scatteredDays.filter(
                (date) => date.getFullYear() === selectedYear,
              )}
            />

            <StreakTrackerYearSelector
              dates={scatteredDays}
              value={selectedYear}
              onValueChange={setSelectedYear}
            />
          </div>
        </section>
      </div>

      <footer>
        <p className="pb-16">
          Made by{" "}
          <a
            href="https://aziznal.com"
            target="_blank"
            className="text-rose-600"
          >
            aziznal
          </a>
        </p>
      </footer>
    </div>
  );
}
