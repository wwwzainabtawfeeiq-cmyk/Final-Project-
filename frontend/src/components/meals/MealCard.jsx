import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Plus,
  Check,
  Heart,
  Share2,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/utils/cn";

const formatPrice = (price) => {
  const value = Number(price || 0);
  return `${value.toLocaleString("en-US")} IQD`;
};

export default function MealCard({ meal, index = 0 }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [added, setAdded] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const isArabic = lang === "ar";

  const mealName = isArabic
    ? meal.name_ar || meal.name
    : meal.name_en || meal.name;

  const mealDescription = isArabic
    ? meal.description_ar || meal.description
    : meal.description_en || meal.description;

  const image =
    meal.image_url ||
    meal.image ||
    "/default-meal.jpg";

  const rating = Number(meal.rating || 0);
  const reviewCount = Number(meal.review_count || 0);
  const availableQuantity = Number(meal.available_quantity || 0);

  const fav = isFavorite(meal.id);

  const handleAdd = () => {
    if (availableQuantity <= 0) return;

    addItem(meal.id);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleImageDoubleClick = () => {
    if (!fav) {
      toggleFavorite(meal.id);
    }

    setShowHeartAnim(true);

    setTimeout(() => {
      setShowHeartAnim(false);
    }, 800);
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: (index % 6) * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -8 }}
        className="group relative rounded-2xl overflow-hidden glass-light transition-all duration-500 hover:gold-glow"
      >
        <div
          className="relative h-52 overflow-hidden cursor-pointer"
          onDoubleClick={handleImageDoubleClick}
        >
          <img
            src={image}
            alt={mealName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

          <AnimatePresence>
            {showHeartAnim && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <Heart
                  size={70}
                  className="fill-gold text-gold drop-shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold font-cairo z-10"
            style={{
              background:
                "linear-gradient(135deg, #C9A227, #F5D76E)",
            }}
          >
            <span className="text-emerald-deep">
              {formatPrice(meal.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(meal.id)}
            className="absolute top-3 left-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:gold-glow transition-all z-10"
          >
            <Heart
              size={16}
              className={cn(
                fav
                  ? "fill-gold text-gold"
                  : "text-cream/70"
              )}
            />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="absolute top-14 left-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:gold-glow transition-all z-10 text-cream/80"
            title={t("مشاركة الوجبة", "Share meal")}
          >
            <Share2 size={16} />
          </button>

          {copied && (
            <div className="absolute top-28 left-3 bg-emerald-deep text-gold text-[10px] px-2 py-1 rounded-md border border-gold/40 z-20 font-tajawal">
              {t("تم النسخ!", "Copied!")}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-ruqaa text-xl text-cream group-hover:text-gold-bright transition-colors">
              {mealName}
            </h3>

            <div className="flex items-center gap-1 shrink-0">
              <Star
                size={14}
                className="fill-gold text-gold"
              />

              <span className="font-cairo text-sm text-gold-bright">
                {rating > 0 ? rating.toFixed(1) : "—"}
              </span>
            </div>
          </div>

          <p className="text-cream/60 text-sm font-tajawal leading-relaxed mb-3 line-clamp-2">
            {mealDescription || t("لا يوجد وصف", "No description")}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="text-cream/50 text-xs font-tajawal">
              {availableQuantity > 0
                ? `${t("متوفر", "Available")}: ${availableQuantity}`
                : t("غير متوفر", "Out of stock")}
            </div>

            <button
              type="button"
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-1.5 text-gold text-xs font-tajawal hover:underline"
            >
              <Star size={14} />
              <span>
                {reviewCount}{" "}
                {t("تقييم", "Reviews")}
              </span>
            </button>
          </div>

          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={availableQuantity <= 0}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-full py-2.5 rounded-xl font-tajawal font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden",
              added
                ? "bg-green-600 text-cream"
                : availableQuantity <= 0
                ? "bg-gray-600 text-cream/60 cursor-not-allowed"
                : ""
            )}
            style={
              !added && availableQuantity > 0
                ? {
                    background:
                      "linear-gradient(135deg, #C9A227, #F5D76E)",
                  }
                : {}
            }
          >
            {added ? (
              <>
                <Check size={18} />
                {t("تمت الإضافة", "Added")}
              </>
            ) : availableQuantity <= 0 ? (
              t("غير متوفر", "Out of stock")
            ) : (
              <>
                <Plus size={18} />
                <span className="text-emerald-deep">
                  {t("أضف للسلة", "Add to Cart")}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReviews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowReviews(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden glass-light border border-gold/30 shadow-2xl p-6 bg-emerald-deep text-cream"
            >
              <div className="flex items-center justify-between mb-4 border-b border-gold/20 pb-3">
                <h3 className="font-ruqaa text-2xl text-gold-bright">
                  {isArabic
                    ? `تقييمات ${mealName}`
                    : `Reviews for ${mealName}`}
                </h3>

                <button
                  type="button"
                  onClick={() => setShowReviews(false)}
                  className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/55 text-cream transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-center py-8">
                <Star
                  size={42}
                  className="mx-auto fill-gold text-gold mb-3"
                />

                <div className="text-3xl font-bold text-gold-bright">
                  {rating > 0 ? rating.toFixed(1) : "—"}
                </div>

                <p className="text-cream/60 font-tajawal mt-2">
                  {reviewCount}{" "}
                  {t("تقييم من قاعدة البيانات", "reviews from the database")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
