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
    <nav
      aria-label="Setup stages"
      className="border-b border-garden-ground/30 bg-pale-mineral"
    >
      <p className="px-4 py-3 text-sm font-semibold text-garden-ground sm:px-5">
        Step {activeStep} of 4
      </p>
      <ol className="grid grid-cols-4 border-t border-garden-ground/25 lg:grid-cols-1">
        {STEPS.map((step) => {
          const isActive = step.number === activeStep;
          const isComplete = completedSteps.includes(step.number);
          const isLocked = !isActive && !isComplete;

          return (
            <li
              key={step.number}
              className="border-r border-garden-ground/20 last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onEdit(step.number)}
                disabled={isLocked}
                aria-current={isActive ? "step" : undefined}
                aria-label={
                  isComplete && !isActive
                    ? `Edit ${step.label.toLocaleLowerCase("en-GB")}`
                    : step.label
                }
                className={`flex min-h-11 w-full flex-col items-start gap-1 px-2 py-3 text-left text-xs transition-colors sm:px-3 lg:grid lg:grid-cols-[2rem_minmax(0,1fr)] lg:items-center lg:gap-x-3 lg:px-5 lg:text-sm ${focusRing} ${
                  isActive
                    ? "bg-moss-veil/50 text-garden-ground"
                    : isComplete
                      ? "text-garden-ground hover:bg-moss-veil/25"
                      : "cursor-not-allowed text-garden-ground/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-semibold ${
                    isActive || isComplete
                      ? "border-garden-ground text-garden-ground"
                      : "border-garden-ground/30"
                  }`}
                >
                  {step.number}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-4">
                    {step.label}
                  </span>
                  {isComplete && (
                    <span className="mt-1 hidden text-xs leading-4 text-garden-ground/70 sm:block">
                      {summaries[step.number] ?? "Complete"}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
