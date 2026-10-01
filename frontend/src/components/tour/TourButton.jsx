import { useState } from "react";
import { HelpCircle } from "lucide-react";
import GuidedTour from "./GuidedTour";

export default function TourButton() {
  const [run, setRun] = useState(false);

  return (
    <>
      <button
        onClick={() => setRun(true)}
        aria-label="جولة تعريفية"
        className="fixed bottom-28 right-6 z-40 h-11 w-11 rounded-full glass shadow-gold grid place-items-center text-gold hover:bg-gold hover:text-black-deep transition-colors"
      >
        <HelpCircle size={18} />
      </button>
      <GuidedTour run={run} onFinish={() => setRun(false)} />
    </>
  );
}
