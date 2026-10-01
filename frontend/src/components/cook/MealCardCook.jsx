import { motion } from "framer-motion";
import {
  Star,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} IQD`;

export default function MealCardCook({
  meal,
  hidden = false,
  onEdit,
  onDelete,
  onToggleHide,
}) {
  const { t, lang } = useLanguage();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className={`h-full w-full object-cover transition-all ${
            hidden ? "grayscale opacity-60" : ""
          }`}
        />

        {hidden && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white">
              {t("مخفي", "Hidden")}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-white">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-semibold">
            {Number(meal.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-bold">
          {lang === "ar" ? meal.name : meal.nameEn || meal.name}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="font-bold text-primary">
            {formatPrice(meal.price)}
          </span>

          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={14} />
            {meal.prepTime || "-"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(meal)}
            className="rounded-lg border p-2 transition-colors hover:bg-muted"
            title={t("تعديل", "Edit")}
          >
            <Edit size={16} />
          </button>

          <button
            type="button"
            onClick={() => onToggleHide(meal.id)}
            className="rounded-lg border p-2 transition-colors hover:bg-muted"
            title={hidden ? t("إظهار", "Show") : t("إخفاء", "Hide")}
          >
            {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button
            type="button"
            onClick={() => onDelete(meal.id)}
            className="rounded-lg border p-2 text-destructive transition-colors hover:bg-destructive/10"
            title={t("حذف", "Delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
