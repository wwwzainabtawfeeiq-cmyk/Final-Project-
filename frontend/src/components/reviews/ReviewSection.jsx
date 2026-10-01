import { useState } from "react";
import { Star } from "lucide-react";

function StarInput({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-cream/60">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`${label} ${n}`}
          >
            <Star
              size={16}
              className={n <= value ? "text-gold" : "text-cream/20"}
              fill={n <= value ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [taste, setTaste] = useState(5);
  const [packaging, setPackaging] = useState(5);
  const [speed, setSpeed] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [comment, setComment] = useState("");

  const submit = () => {
    onSubmit({
      customerName: "أنت",
      rating,
      taste,
      packaging,
      speed,
      cleanliness,
      comment,
    });
    setComment("");
  };

  return (
    <div className="rounded-2xl border border-gold/15 p-5 space-y-4">
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            aria-label={`تقييم ${n}`}
          >
            <Star
              size={26}
              className={n <= rating ? "text-gold" : "text-cream/20"}
              fill={n <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <StarInput label="الطعم" value={taste} onChange={setTaste} />
        <StarInput label="التغليف" value={packaging} onChange={setPackaging} />
        <StarInput label="السرعة" value={speed} onChange={setSpeed} />
        <StarInput
          label="النظافة"
          value={cleanliness}
          onChange={setCleanliness}
        />
      </div>
      <textarea
        rows={3}
        placeholder="شاركنا رأيك بالطبخة..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-xl bg-black-deep/40 border border-gold/25 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:outline-none focus:border-gold"
      />

      <button
        onClick={submit}
        className="w-full rounded-full bg-gradient-to-l from-gold to-gold-light text-black-deep py-3 font-medium"
      >
        إرسال التقييم
      </button>
    </div>
  );
}

export default function ReviewSection({ reviews = [] }) {
  if (!reviews.length)
    return (
      <p className="text-center text-cream/40 py-10">لا توجد تقييمات بعد.</p>
    );
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <div key={i} className="rounded-xl border border-gold/15 p-4">
          <div className="flex items-center justify-between">
            <span className="text-cream text-sm">{r.customerName}</span>
            <span className="flex items-center gap-1 text-gold text-xs">
              <Star size={12} fill="currentColor" /> {r.rating}
            </span>
          </div>
          <p className="text-cream/60 text-sm mt-2">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
