"use client";

type Step = 1 | 2 | 3 | 4;

interface Props {
  activeStep: Step;
  completedSteps: number[];
  onEdit: (step: Step) => void;
}

const STEPS: { number: Step; label: string }[] = [
  { number: 1, label: "Your location" },
  { number: 2, label: "What you want to grow" },
  { number: 3, label: "Your plot" },
  { number: 4, label: "Your tool shed" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function SetupProgress({
  activeStep,
  completedSteps,
  onEdit,
}: Props) {
  return (
    <nav aria-label="Setup stages" className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-dark-earth">
          Step {activeStep} of 4
        </p>
        <progress
          aria-label="Setup progress"
          value={activeStep}
          max={4}
          className="h-2 w-full accent-moss"
        />
      </div>
      <ol className="grid gap-2 sm:grid-cols-2">
        {STEPS.map((step) => {
          const isActive = step.number === activeStep;
          const isComplete = completedSteps.includes(step.number);

          return (
            <li
              key={step.number}
              aria-current={isActive ? "step" : undefined}
              className={`flex min-h-11 items-center justify-between gap-3 rounded-btn px-3 py-2 text-sm ${
                isActive
                  ? "bg-light-sage/70 text-dark-earth ring-1 ring-moss/40"
                  : "bg-warm-stone/50 text-moss"
              }`}
            >
              <span>
                <span className="block font-semibold">{step.label}</span>
                {isComplete && (
                  <span className="block text-xs text-moss">Complete</span>
                )}
              </span>
              {isComplete && !isActive && (
                <button
                  type="button"
                  onClick={() => onEdit(step.number)}
                  aria-label={`Edit ${step.label.toLocaleLowerCase("en-GB")}`}
                  className={`min-h-11 rounded-btn px-3 py-2 font-semibold text-dark-earth underline decoration-light-sage underline-offset-4 hover:decoration-moss ${focusRing}`}
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
