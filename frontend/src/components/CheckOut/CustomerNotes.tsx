import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const QUICK_CHIPS = ["بدون بصل", "حار زيادة", "بدون حار", "قليل ملح", "توصيل بدون اتصال"];
const MAX_LEN = 500;

export type CustomerNotesValue = { notes: string; hasAllergy: boolean; allergyDetails: string };

export default function CustomerNotes({
  value,
  onChange,
}: {
  value: CustomerNotesValue;
  onChange: (v: CustomerNotesValue) => void;
}) {
  const [chipsUsed, setChipsUsed] = useState<string[]>([]);

  const addChip = (chip: string) => {
    if (chipsUsed.includes(chip)) return;
    const next = value.notes ? `${value.notes}، ${chip}` : chip;
    onChange({ ...value, notes: next.slice(0, MAX_LEN) });
    setChipsUsed((p) => [...p, chip]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {QUICK_CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => addChip(c)}
            disabled={chipsUsed.includes(c)}
            className="text-xs rounded-full border border-gold/25 px-3 py-1.5 text-cream/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-colors"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          rows={3}
          maxLength={MAX_LEN}
          placeholder="أي ملاحظات إضافية على طلبك؟"
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
        />
        <span className="absolute bottom-2 left-3 text-[10px] text-cream/30">{value.notes.length}/{MAX_LEN}</span>
      </div>

      <label className="flex items-center gap-2 text-sm text-cream/70">
        <input
          type="checkbox" checked={value.hasAllergy}
          onChange={(e) => onChange({ ...value, hasAllergy: e.target.checked })}
          className="accent-gold"
        />
        <AlertTriangle size={14} className="text-gold" /> لدي حساسية من مكوّن معيّن
      </label>

      {value.hasAllergy && (
        <input
          placeholder="اذكر نوع الحساسية (مثال: مكسرات، مأكولات بحرية...)"
          value={value.allergyDetails}
          onChange={(e) => onChange({ ...value, allergyDetails: e.target.value })}
          className="w-full rounded-xl bg-black-deep/40 border border-gold/40 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
        />
      )}
    </div>
  );
}
