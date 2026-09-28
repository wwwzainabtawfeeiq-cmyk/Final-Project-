import { Cake, GraduationCap, Heart, Frown, MoreHorizontal, Zap } from "lucide-react";

export type EventDetails = {
  isEvent: boolean;
  type?: "birthday" | "graduation" | "wedding" | "condolence" | "other";
  guests?: number;
  date?: string;
  time?: string;
  notes?: string;
  urgent?: boolean;
};

const TYPES: { key: NonNullable<EventDetails["type"]>; label: string; icon: typeof Cake }[] = [
  { key: "birthday", label: "عيد ميلاد", icon: Cake },
  { key: "graduation", label: "تخرج", icon: GraduationCap },
  { key: "wedding", label: "زفاف", icon: Heart },
  { key: "condolence", label: "عزاء", icon: Frown },
  { key: "other", label: "أخرى", icon: MoreHorizontal },
];

export default function EventDetailsForm({
  value,
  onChange,
}: {
  value: EventDetails;
  onChange: (v: EventDetails) => void;
}) {
  const set = <K extends keyof EventDetails>(k: K, v: EventDetails[K]) => onChange({ ...value, [k]: v });

  return (
    <div className="rounded-2xl border border-gold/15 p-5 space-y-4">
      <label className="flex items-center justify-between">
        <span className="text-cream">هل هذا الطلب لمناسبة؟</span>
        <button
          onClick={() => set("isEvent", !value.isEvent)}
          className={"w-12 h-7 rounded-full transition-colors relative " + (value.isEvent ? "bg-gold" : "bg-cream/15")}
          aria-pressed={value.isEvent}
        >
          <span className={"absolute top-1 h-5 w-5 rounded-full bg-black-deep transition-all " + (value.isEvent ? "right-1" : "right-6")} />
        </button>
      </label>

      {value.isEvent && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {TYPES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => set("type", key)}
                className={
                  "flex flex-col items-center gap-1 rounded-xl py-3 text-xs border transition-colors " +
                  (value.type === key ? "bg-gold/15 border-gold text-gold" : "border-gold/15 text-cream/60")
                }
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="number" min={1} placeholder="عدد الأشخاص" value={value.guests ?? ""}
              onChange={(e) => set("guests", Number(e.target.value))}
              className="rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
            />
            <input
              type="date" value={value.date ?? ""} onChange={(e) => set("date", e.target.value)}
              className="rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
            />
            <input
              type="time" value={value.time ?? ""} onChange={(e) => set("time", e.target.value)}
              className="rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold"
            />
          </div>

          <textarea
            rows={2} placeholder="ملاحظات إضافية عن المناسبة" value={value.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
          />

          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input type="checkbox" checked={!!value.urgent} onChange={(e) => set("urgent", e.target.checked)} className="accent-gold" />
            <Zap size={14} className="text-gold" /> مستعجل (رسوم إضافية)
          </label>
        </>
      )}
    </div>
  );
}
