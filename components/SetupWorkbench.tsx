import type { ReactNode } from "react";
import GardenPortrait from "./GardenPortrait";
import type { GardenPortraitProps } from "./GardenPortrait";
import SetupProgress from "./SetupProgress";

interface Props {
  activeStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  summaries: Partial<Record<1 | 2 | 3 | 4, string>>;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
  portrait: Omit<GardenPortraitProps, "variant">;
  controls: ReactNode;
}

export default function SetupWorkbench({
  activeStep,
  completedSteps,
  summaries,
  onEdit,
  portrait,
  controls,
}: Props) {
  return (
    <main
      data-surface="setup-workbench"
      className="bg-pale-mineral px-4 py-6 text-garden-ground sm:px-6 sm:py-8"
    >
      <div className="mx-auto grid max-w-7xl border border-garden-ground/30 lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 border-b border-garden-ground/30 lg:border-b-0 lg:border-r">
          <SetupProgress
            activeStep={activeStep}
            completedSteps={completedSteps}
            summaries={summaries}
            onEdit={onEdit}
          />
          {controls}
        </div>
        <GardenPortrait
          {...portrait}
          variant="setup"
          className="border-0 lg:min-h-full"
        />
      </div>
    </main>
  );
}
