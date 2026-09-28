import { useState } from "react";

type MethodKey = "cod" | "mastercard" | "zaincash" | "asiacell" | "fastpay";

const METHODS: { key: MethodKey; label: string }[] = [
  { key: "cod", label: "الدفع نقداً عند الاستلام" },
  { key: "mastercard", label: "Mastercard" },
  { key: "zaincash", label: "زين كاش" },
  { key: "asiacell", label: "آسيا حوالة" },
  { key: "fastpay", label: "FastPay" },
];

export type PaymentValue = {
  method: MethodKey;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  walletPhone?: string;
};

function validate(v: PaymentValue): string | null {
  if (v.method === "mastercard") {
    if (!v.cardNumber || v.cardNumber.replace(/\s/g, "").length !== 16) return "رقم البطاقة يجب أن يتكون من 16 رقماً";
    if (!v.cardExpiry || !/^\d{2}\/\d{2}$/.test(v.cardExpiry)) return "صيغة تاريخ الانتهاء يجب أن تكون MM/YY";
    if (!v.cardCvv || v.cardCvv.length !== 3) return "رمز CVV يجب أن يتكون من 3 أرقام";
  }
  if (["zaincash", "asiacell", "fastpay"].includes(v.method)) {
    if (!v.walletPhone || v.walletPhone.length < 10) return "أدخل رقم هاتف المحفظة بشكل صحيح";
  }
  return null;
}

export default function PaymentMethod({
  value,
  onChange,
}: {
  value: PaymentValue;
  onChange: (v: PaymentValue, error: string | null) => void;
}) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validate(value) : null;

  const update = (patch: Partial<PaymentValue>) => {
    const next = { ...value, ...patch };
    onChange(next, validate(next));
  };

  return (
    <div className="space-y-3">
      {METHODS.map((m) => (
        <div key={m.key}>
          <button
            onClick={() => { setTouched(false); update({ method: m.key }); }}
            className={
              "w-full text-right rounded-xl border px-4 py-3 text-sm transition-colors " +
              (value.method === m.key ? "border-gold text-gold bg-gold/5" : "border-gold/20 text-cream/70")
            }
          >
            {m.label}
          </button>

          {value.method === m.key && m.key === "mastercard" && (
            <div className="grid grid-cols-2 gap-3 mt-2 mb-1">
              <input
                placeholder="رقم البطاقة" maxLength={19} value={value.cardNumber || ""}
                onChange={(e) => update({ cardNumber: e.target.value })}
                onBlur={() => setTouched(true)}
                className="col-span-2 rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
              />
              <input
                placeholder="MM/YY" maxLength={5} value={value.cardExpiry || ""}
                onChange={(e) => update({ cardExpiry: e.target.value })}
                onBlur={() => setTouched(true)}
                className="rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
              />
              <input
                placeholder="CVV" maxLength={3} value={value.cardCvv || ""}
                onChange={(e) => update({ cardCvv: e.target.value })}
                onBlur={() => setTouched(true)}
                className="rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
              />
            </div>
          )}

          {value.method === m.key && ["zaincash", "asiacell", "fastpay"].includes(m.key) && (
            <input
              placeholder="رقم هاتف المحفظة" value={value.walletPhone || ""}
              onChange={(e) => update({ walletPhone: e.target.value })}
              onBlur={() => setTouched(true)}
              className="w-full mt-2 rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
            />
          )}
        </div>
      ))}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
