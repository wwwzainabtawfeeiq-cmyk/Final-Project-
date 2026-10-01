import { useState } from "react";
import { X, User, Calendar } from "lucide-react";

const DEFAULT = { forSomeoneElse: false, scheduled: false };

export default function PreOrderModal({ onClose, onSave, initial = DEFAULT }) {
  const [info, setInfo] = useState(initial);
  const set = (k, v) => setInfo((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black-deep/70 backdrop-blur-sm px-6">
      <div className="glass rounded-3xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-cream">تفاصيل الطلب</h2>
          <button
            onClick={onClose}
            className="text-cream/60 hover:text-gold"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => set("forSomeoneElse", false)}
            className={
              "flex-1 rounded-full py-2.5 text-sm border " +
              (!info.forSomeoneElse
                ? "bg-gold text-black-deep border-gold"
                : "border-gold/25 text-cream/70")
            }
          >
            اطلب لنفسي
          </button>
          <button
            onClick={() => set("forSomeoneElse", true)}
            className={
              "flex-1 rounded-full py-2.5 text-sm border " +
              (info.forSomeoneElse
                ? "bg-gold text-black-deep border-gold"
                : "border-gold/25 text-cream/70")
            }
          >
            اطلب لشخص آخر
          </button>
        </div>

        {info.forSomeoneElse && (
          <div className="space-y-3 mb-5">
            <div className="relative">
              <User
                size={15}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-cream/35"
              />
              <input
                placeholder="اسم المستلم"
                value={info.recipientName || ""}
                onChange={(e) => set("recipientName", e.target.value)}
                className="w-full rounded-xl bg-black-deep/40 border border-gold/25 pr-9 pl-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
              />
            </div>
            <input
              placeholder="رقم هاتف المستلم"
              value={info.recipientPhone || ""}
              onChange={(e) => set("recipientPhone", e.target.value)}
              className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
            />

            <input
              placeholder="عنوان المستلم"
              value={info.recipientAddress || ""}
              onChange={(e) => set("recipientAddress", e.target.value)}
              className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
            />

            <textarea
              placeholder="رسالة مرفقة (اختياري)"
              rows={2}
              value={info.message || ""}
              onChange={(e) => set("message", e.target.value)}
              className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-cream/70 mb-3">
          <input
            type="checkbox"
            checked={info.scheduled}
            onChange={(e) => set("scheduled", e.target.checked)}
            className="accent-gold"
          />
          طلب مجدول لوقت لاحق
        </label>

        {info.scheduled && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="relative">
              <Calendar
                size={14}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-cream/35"
              />
              <input
                type="date"
                value={info.date || ""}
                onChange={(e) => set("date", e.target.value)}
                className="w-full rounded-xl bg-black-deep/40 border border-gold/25 pr-9 pl-3 py-3 text-sm text-cream focus:outline-none focus:border-gold"
              />
            </div>
            <input
              type="time"
              value={info.time || ""}
              onChange={(e) => set("time", e.target.value)}
              className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-3 py-3 text-sm text-cream focus:outline-none focus:border-gold"
            />
          </div>
        )}

        <button
          onClick={() => onSave(info)}
          className="w-full rounded-full bg-gradient-to-l from-gold to-gold-light text-black-deep py-3 font-medium"
        >
          حفظ التفاصيل
        </button>
      </div>
    </div>
  );
}
