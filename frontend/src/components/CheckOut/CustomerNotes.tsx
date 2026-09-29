import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const QUICK_CHIPS = [
  'بدون بصل',
  'حار زيادة',
  'بدون حار',
  'قليل ملح',
  'توصيل بدون اتصال',
];
const MAX_LEN = 500;

export type CustomerNotesValue = {
  notes: string;
  hasAllergy: boolean;
  allergyDetails: string;
};

// 🔥 نمط الحقول المضمون
const INPUT_STYLE: React.CSSProperties = {
  color: '#FFFFFF',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(201, 162, 39, 0.35)',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  fontFamily: 'Tajawal, sans-serif',
  fontSize: '16px',
  outline: 'none',
  transition: 'all 0.2s ease',
};

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

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.currentTarget.style.borderColor = '#F5D76E';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 162, 39, 0.2)';
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.35)';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
  };

  return (
    <div className="space-y-3">
      {/* Chips الجاهزة */}
      <div className="flex flex-wrap gap-2">
        {QUICK_CHIPS.map((c) => {
          const used = chipsUsed.includes(c);
          return (
            <button
              type="button"
              key={c}
              onClick={() => addChip(c)}
              disabled={used}
              className="text-xs rounded-full px-3 py-1.5 font-tajawal transition-all"
              style={{
                border: used
                  ? '1px solid rgba(201, 162, 39, 0.15)'
                  : '1px solid rgba(201, 162, 39, 0.35)',
                color: used ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.75)',
                backgroundColor: used
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(255, 255, 255, 0.06)',
                cursor: used ? 'not-allowed' : 'pointer',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          maxLength={MAX_LEN}
          placeholder="أي ملاحظات إضافية على طلبك؟"
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '100px' }}
        />
        <span
          className="absolute bottom-2 left-3 text-[10px] font-cairo"
          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
        >
          {value.notes.length}/{MAX_LEN}
        </span>
      </div>

      {/* Checkbox الحساسية */}
      <label className="flex items-center gap-2 text-sm font-tajawal cursor-pointer">
        <input
          type="checkbox"
          checked={value.hasAllergy}
          onChange={(e) => onChange({ ...value, hasAllergy: e.target.checked })}
          className="accent-gold w-4 h-4"
        />
        <AlertTriangle size={14} style={{ color: '#F5D76E' }} />
        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          لدي حساسية من مكوّن معيّن
        </span>
      </label>

      {/* تفاصيل الحساسية */}
      {value.hasAllergy && (
        <input
          type="text"
          placeholder="اذكر نوع الحساسية (مثال: مكسرات، مأكولات بحرية...)"
          value={value.allergyDetails}
          onChange={(e) =>
            onChange({ ...value, allergyDetails: e.target.value })
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            ...INPUT_STYLE,
            borderColor: 'rgba(239, 68, 68, 0.6)',
          }}
        />
      )}
    </div>
  );
}