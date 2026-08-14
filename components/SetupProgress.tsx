"use client";

type Step = 1 | 2 | 3 | 4;

interface Props {
  activeStep: Step;
  completedSteps: number[];
  summaries?: Partial<Record<Step, string>>;
  onEdit: (step: Step) => void;
}

const STEPS: { number: Step; label: string }[] = [
  { number: 1, label: "Your location" },
  { number: 2, label: "What you want to grow" },
  { number: 3, label: "Your plot" },
  { number: 4, label: "Your tool shed" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garden-ground focus-visible:ring-offset-2 focus-visible:ring-offset-pale-mineral";

export default function SetupProgress({
  activeStep,
  completedSteps,
  summaries = {},
  onEdit,
}: Props) {
  return (
    <nav aria-label="Setup stages" className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-garden-ground">
          Step {activeStep} of 4
        </p>
        <progress
          aria-label="Setup progress"
          value={activeStep}
          max={4}
          className="h-2 w-full accent-rain-ink"
        />
      </div>
      <ol className="grid border-y border-garden-ground/25 sm:grid-cols-2">
        {STEPS.map((step) => {
          const isActive = step.number === activeStep;
          const isComplete = completedSteps.includes(step.number);

          return (
            <li
              key={step.number}
              aria-current={isActive ? "step" : undefined}
              className={`flex min-h-11 items-center justify-between gap-3 border-b border-garden-ground/20 px-3 py-2 text-sm last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 ${
                isActive
                  ? "bg-moss-veil/45 text-garden-ground"
                  : "text-garden-ground/75"
              }`}
            >
              <span>
                <span className="block font-semibold">{step.label}</span>
                {isComplete && (
                  <span className="block text-xs text-garden-ground/70">
                    {summaries[step.number] ?? "Complete"}
                  </span>
                )}
              </span>
              {isComplete && !isActive && (
                <button
                  type="button"
                  onClick={() => onEdit(step.number)}
                  aria-label={`Edit ${step.label.toLocaleLowerCase("en-GB")}`}
                  className={`min-h-11 px-3 py-2 font-semibold text-rain-ink underline decoration-rain-ink underline-offset-4 hover:text-garden-ground ${focusRing}`}
                >
                  Edit
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
