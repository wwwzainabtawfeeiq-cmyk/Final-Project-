import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageCircle,
  UserPlus,
  UserCheck,
  ChefHat,
} from "lucide-react";
import { getCook } from "@/services/cookService";
import { getMeals } from "@/services/mealService";
import { useLanguage } from "@/context/LanguageContext";
import { API_URL } from "@/services/api";

export default function CookProfilePage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();

  const [cook, setCook] = useState(null);
  const [cookMeals, setCookMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("meals");
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const loadCook = async () => {
      try {
        setLoading(true);

        const [cookResponse, mealsResponse] = await Promise.all([
          getCook(id),
          getMeals(),
        ]);

        const cookData = cookResponse?.data || cookResponse || null;
        const allMeals = mealsResponse?.data || [];

        setCook(cookData);
        setCookMeals(
          allMeals.filter((meal) => String(meal.cook_id) === String(id))
        );
      } catch (error) {
        console.error("Failed to load cook profile:", error);
        setCook(null);
        setCookMeals([]);
      } finally {
        setLoading(false);
      }
    };

    loadCook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cream/70">
        {lang === "ar" ? "جاري تحميل الملف..." : "Loading profile..."}
      </div>
    );
  }

  if (!cook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-ruqaa text-3xl text-gradient-gold mb-4">
            {t("لم نجد هذا الطباخ", "Cook not found")}
          </h2>

          <Link
            to="/cooks"
            className="inline-block px-6 py-3 rounded-full font-tajawal font-bold text-emerald-deep"
            style={{
              background: "linear-gradient(135deg, #C9A227, #F5D76E)",
            }}
          >
            {t("العودة للطهاة", "Back to Cooks")}
          </Link>
        </div>
      </div>
    );
  }

  const name =
    lang === "ar"
      ? cook.name_ar || cook.name
      : cook.name_en || cook.name;

  const bio =
    lang === "ar"
      ? cook.bio_ar || cook.bio || "طباخ منزلي من نكهة البصرة"
      : cook.bio_en || cook.bio || "Home cook from Basra Flavor";

  const specialty =
    lang === "ar" ? "طباخ منزلي" : "Home Cook";

  const imageUrl = cook.image_url
    ? `${API_URL.replace(/\/api$/, "")}${cook.image_url}`
    : null;

  const TABS = [
    { key: "meals", label: t("الأطباق", "Dishes") },
    { key: "services", label: t("الخدمات", "Services") },
    { key: "reviews", label: t("التقييمات", "Reviews") },
    { key: "bio", label: t("نبذة", "About") },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="relative h-32 w-32 mb-4">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(201,162,39,0.5), transparent 70%)",
              }}
            />

            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-gold-bright shadow-lg flex items-center justify-center bg-emerald-deep">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ChefHat size={48} className="text-gold-bright" />
              )}
            </div>
          </div>

          <h1 className="font-ruqaa text-4xl md:text-5xl text-gradient-gold mb-2">
            {name}
          </h1>

          <p className="flex items-center gap-2 text-gold-bright font-tajawal mb-3">
            <ChefHat size={16} />
            {specialty}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-cream/60 font-tajawal text-sm mb-5">
            {cook.is_verified && (
              <span className="text-gold-bright">
                ✓ {t("موثق", "Verified")}
              </span>
            )}

            {cook.address && <span>📍 {cook.address}</span>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFollowing((v) => !v)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all ${
                following
                  ? "border border-gold/40 text-gold-bright"
                  : "text-emerald-deep"
              }`}
              style={
                !following
                  ? {
                      background:
                        "linear-gradient(135deg, #C9A227, #F5D76E)",
                    }
                  : {}
              }
            >
              {following ? (
                <UserCheck size={16} />
              ) : (
                <UserPlus size={16} />
              )}

              {following
                ? t("متابع", "Following")
                : t("متابعة", "Follow")}
            </button>

            <button
              type="button"
              onClick={() => {
                if (cook.phone) {
                  window.location.href = `tel:${cook.phone}`;
                }
              }}
              className="flex items-center gap-2 rounded-full border border-gold/40 text-gold-bright px-6 py-3 text-sm font-bold"
            >
              <MessageCircle size={16} />
              {t("تواصل معه", "Contact")}
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center gap-2 border-b border-gold/15 mb-8 overflow-x-auto">
          {TABS.map((tabItem) => (
            <button
              type="button"
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`relative px-6 py-3 font-tajawal text-sm whitespace-nowrap ${
                tab === tabItem.key
                  ? "text-gold-bright font-bold"
                  : "text-cream/50"
              }`}
            >
              {tabItem.label}

              {tab === tabItem.key && (
                <motion.span
                  layoutId="cookTabUnderline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {tab === "meals" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cookMeals.length === 0 ? (
                  <p className="col-span-full text-center text-cream/40 py-10">
                    {t("لا توجد أطباق بعد", "No dishes yet")}
                  </p>
                ) : (
                  cookMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-2xl overflow-hidden border border-gold/20 hover:border-gold-bright transition-all group"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="p-3 bg-emerald-deep">
                        <h3 className="font-tajawal font-bold text-cream text-sm truncate">
                          {meal.name}
                        </h3>

                        <p className="font-cairo text-gold-bright text-xs mt-1">
                          {Number(meal.price || 0).toLocaleString()} د.ع
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "services" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  t("طلبات المناسبات", "Event Orders"),
                  t("الطلب المسبق", "Pre-Order"),
                  t("التوصيل السريع", "Fast Delivery"),
                  t("الوجبات الأسبوعية", "Weekly Meals"),
                ].map((service) => (
                  <div
                    key={service}
                    className="rounded-2xl border border-gold/20 p-5 text-cream/80 bg-emerald-deep/50"
                  >
                    ✓ {service}
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="text-center text-cream/40 py-10">
                <Star className="mx-auto mb-3 text-gold-bright" />
                {t("لا توجد تقييمات بعد", "No reviews yet")}
              </div>
            )}

            {tab === "bio" && (
              <div className="max-w-2xl mx-auto text-center rounded-2xl border border-gold/20 p-8 bg-emerald-deep/50">
                <p className="font-tajawal text-cream/80 leading-relaxed">
                  {bio}
                </p>

                {cook.phone && (
                  <p className="mt-4 text-gold-bright font-tajawal">
                    📞 {cook.phone}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
