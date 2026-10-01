import Joyride, { STATUS } from "react-joyride";

const STEPS = [
  {
    target: '[data-tour="hero"]',
    content: "أهلاً بك في نكهة البصرة! هنا يمكنك استكشاف كل الأطباق الأصيلة.",
  },
  {
    target: '[data-tour="meals-nav"]',
    content: "من هنا تستعرض كل الأطباق المتوفرة اليوم.",
  },
  {
    target: '[data-tour="cooks-nav"]',
    content: "وهنا تتعرف على طباخينا المحترفين.",
  },
  {
    target: '[data-tour="cart-icon"]',
    content: "سلة مشترياتك تظهر هنا في كل صفحة.",
  },
  {
    target: '[data-tour="ai-button"]',
    content: "وهذا مساعدنا الذكي جاهز لمساعدتك.",
  },
];
const TOUR_KEY = "bf_tour_completed";
export default function GuidedTour({ run, onFinish }) {
  const handleCallback = (data) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      localStorage.setItem(TOUR_KEY, "1");
      onFinish();
    }
  };

  return (
    <Joyride
      run={run}
      steps={STEPS}
      continuous
      showSkipButton
      callback={handleCallback}
      locale={{
        back: "السابق",
        close: "إغلاق",
        last: "إنهاء",
        next: "التالي",
        skip: "تخطي",
      }}
      styles={{
        options: {
          primaryColor: "#C9A227",
          backgroundColor: "#0F2419",
          textColor: "#F5F0E1",
          arrowColor: "#0F2419",
          zIndex: 200,
        },
        buttonNext: { borderRadius: 999, padding: "8px 18px" },
        buttonBack: { color: "#C9A227" },
      }}
    />
  );
}

export { TOUR_KEY };
