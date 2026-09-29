import { Cake, GraduationCap, Heart, Frown, MoreHorizontal, Zap } from 'lucide-react';

export type EventDetails = {
  isEvent: boolean;
  type?: 'birthday' | 'graduation' | 'wedding' | 'condolence' | 'other';
  guests?: number;
  date?: string;
  time?: string;
  notes?: string;
  urgent?: boolean;
};

const TYPES: {
  key: NonNullable<EventDetails['type']>;
  label: string;
  icon: typeof Cake;
}[] = [
  { key: 'birthday', label: 'عيد ميلاد', icon: Cake },
  { key: 'graduation', label: 'تخرج', icon: GraduationCap },
  { key: 'wedding', label: 'زفاف', icon: Heart },
  { key: 'condolence', label: 'عزاء', icon: Frown },
  { key: 'other', label: 'أخرى', icon: MoreHorizontal },
];

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
  colorScheme: 'dark',
};

export default function EventDetailsForm({
  value,
  onChange,
}: {
  value: EventDetails;
  onChange: (v: EventDetails) => void;
}) {
  const set = <K extends keyof EventDetails>(k: K, v: EventDetails[K]) =>
    onChange({ ...value, [k]: v });

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
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ border: '1px solid rgba(201, 162, 39, 0.2)' }}
    >
      {/* Toggle */}
      <label className="flex items-center justify-between">
        <span
          className="font-tajawal text-base"
          style={{ color: '#FFFFFF' }}
        >
          هل هذا الطلب لمناسبة؟
        </span>
        <button
          type="button"
          onClick={() => set('isEvent', !value.isEvent)}
          className="w-12 h-7 rounded-full transition-colors relative"
          style={{
            backgroundColor: value.isEvent
              ? '#C9A227'
              : 'rgba(255, 255, 255, 0.15)',
          }}
          aria-pressed={value.isEvent}
        >
          <span
            className="absolute top-1 h-5 w-5 rounded-full transition-all"
            style={{
              backgroundColor: '#0F2419',
              right: value.isEvent ? '4px' : 'calc(100% - 24px)',
            }}
          />
        </button>
      </label>

      {value.isEvent && (
        <>
          {/* أنواع المناسبات */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {TYPES.map(({ key, label, icon: Icon }) => {
              const isActive = value.type === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => set('type', key)}
                  className="flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-tajawal transition-all"
                  style={{
                    border: isActive
                      ? '1px solid #F5D76E'
                      : '1px solid rgba(201, 162, 39, 0.2)',
                    backgroundColor: isActive
                      ? 'rgba(201, 162, 39, 0.15)'
                      : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#F5D76E' : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* حقول المناسبة */}
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="number"
              min={1}
              placeholder="عدد الأشخاص"
              value={value.guests ?? ''}
              onChange={(e) => set('guests', Number(e.target.value))}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={INPUT_STYLE}
            />
            <input
              type="date"
              value={value.date ?? ''}
              onChange={(e) => set('date', e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={INPUT_STYLE}
            />
            <input
              type="time"
              value={value.time ?? ''}
              onChange={(e) => set('time', e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={INPUT_STYLE}
            />
          </div>

          {/* ملاحظات */}
          <textarea
            rows={2}
            placeholder="ملاحظات إضافية عن المناسبة"
            value={value.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ ...INPUT_STYLE, resize: 'vertical' }}
          />

          {/* مستعجل */}
          <label className="flex items-center gap-2 text-sm font-tajawal cursor-pointer">
            <input
              type="checkbox"
              checked={!!value.urgent}
              onChange={(e) => set('urgent', e.target.checked)}
              className="accent-gold w-4 h-4"
            />
            <Zap size={14} style={{ color: '#F5D76E' }} />
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              مستعجل (رسوم إضافية)
            </span>
          </label>
        </>
      )}
    </div>
  );
}