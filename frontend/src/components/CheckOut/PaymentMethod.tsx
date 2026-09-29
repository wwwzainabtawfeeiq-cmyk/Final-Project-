import { useState } from 'react';

type MethodKey = "cod" | "mastercard" | "zaincash" | "asiacell" | "fastpay";

const METHODS: { key: MethodKey; label: string; labelEn: string }[] = [
  { key: "cod", label: "الدفع نقداً عند الاستلام", labelEn: "Cash on Delivery" },
  { key: "mastercard", label: "بطاقة Mastercard", labelEn: "Mastercard" },
  { key: "zaincash", label: "زين كاش", labelEn: "ZainCash" },
  { key: "asiacell", label: "آسيا حوالة", labelEn: "AsiaHawala" },
  { key: "fastpay", label: "FastPay", labelEn: "FastPay" },
];

export type Value = {
  method: MethodKey;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  walletPhone?: string;
};

function validate(v: Value): string | null {
  if (v.method === "mastercard") {
    if (!v.cardNumber || v.cardNumber.replace(/\s/g, "").length !== 16)
      return "رقم البطاقة يجب أن يتكون من 16 رقماً";
    if (!v.cardExpiry || !/^\d{2}\/\d{2}$/.test(v.cardExpiry))
      return "صيغة تاريخ الانتهاء يجب أن تكون MM/YY";
    if (!v.cardCvv || v.cardCvv.length !== 3)
      return "رمز CVV يجب أن يتكون من 3 أرقام";
  }
  if (["zaincash", "asiacell", "fastpay"].includes(v.method)) {
    if (!v.walletPhone || v.walletPhone.length < 10)
      return "أدخل رقم هاتف المحفظة بشكل صحيح";
  }
  return null;
}

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

export default function PaymentMethod({
  value,
  onChange,
}: {
  value: Value;
  onChange: (v: Value, error: string | null) => void;
}) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validate(value) : null;

  const update = (patch: Partial<Value>) => {
    const next = { ...value, ...patch };
    onChange(next, validate(next));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#F5D76E';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 162, 39, 0.2)';
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.35)';
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    setTouched(true);
  };

  return (
    <div className="space-y-3">
      {METHODS.map((m) => (
        <div key={m.key}>
          <button
            type="button"
            onClick={() => {
              setTouched(false);
              update({ method: m.key });
            }}
            className="w-full text-right rounded-xl px-4 py-3 text-sm font-tajawal transition-all"
            style={{
              border: value.method === m.key
                ? '1px solid #F5D76E'
                : '1px solid rgba(201, 162, 39, 0.25)',
              color: value.method === m.key ? '#F5D76E' : 'rgba(255, 255, 255, 0.75)',
              backgroundColor: value.method === m.key ? 'rgba(201, 162, 39, 0.1)' : 'rgba(255, 255, 255, 0.04)',
            }}
          >
            {m.label}
          </button>

          {value.method === m.key && m.key === "mastercard" && (
            <div className="grid grid-cols-2 gap-3 mt-2 mb-1">
              <input
                type="text"
                placeholder="رقم البطاقة"
                maxLength={19}
                value={value.cardNumber || ""}
                onChange={(e) => update({ cardNumber: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ ...INPUT_STYLE, gridColumn: 'span 2' }}
              />
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={value.cardExpiry || ""}
                onChange={(e) => update({ cardExpiry: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={INPUT_STYLE}
              />
              <input
                type="text"
                placeholder="CVV"
                maxLength={3}
                value={value.cardCvv || ""}
                onChange={(e) => update({ cardCvv: e.target.value })}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={INPUT_STYLE}
              />
            </div>
          )}

          {value.method === m.key && ["zaincash", "asiacell", "fastpay"].includes(m.key) && (
            <input
              type="tel"
              placeholder="رقم هاتف المحفظة"
              value={value.walletPhone || ""}
              onChange={(e) => update({ walletPhone: e.target.value })}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{ ...INPUT_STYLE, marginTop: '8px' }}
            />
          )}
        </div>
      ))}
      {error && (
        <p
          className="text-xs font-tajawal"
          style={{ color: '#f87171' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}