import { StreakTracker } from "@/lib/components/StreakTracker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="h-dvh flex items-center justify-center flex-col">
      <div className="flex-1 flex flex-col justify-end">
        <h1 className="text-2xl font-bold mb-6">Streak Tracker (wip)</h1>

        <div className="border p-4 rounded-lg">
          <StreakTracker values={[new Date(Date.now())]} />
        </div>
      </div>

      <footer className="flex-1 flex flex-col justify-end">
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
