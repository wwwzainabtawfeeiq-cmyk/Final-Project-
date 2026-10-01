import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  MapPin,
  Star,
  Lock,
  ShoppingBag,
  ChefHat,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/utils/formatPrice";

const MOCK_RECIPES = [
  {
    id: 1,
    title: { ar: "ط³ط± ط§ظ„ظ…ط³ظƒظˆظپ ط§ظ„ط£طµظ„ظٹ", en: "Authentic Masgouf Secret" },
    cook: "ط£ظ… ط£ط­ظ…ط¯",
    image:
      "https://images.pexels.com/photos/36796430/pexels-photo-36796430.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "ط§ظ„ط¹ط´ط§ط±",
    price: 50000,
    rating: 4.9,
    buyers: 45,
    secret: { ar: "ط®ظ„ط·ط© ط§ظ„ط¨ظ‡ط§ط±ط§طھ ط§ظ„ط³ط±ظٹط©", en: "Secret spice mix" },
    category: "ظ…ط´ط§ظˆظٹ",
  },
  {
    id: 2,
    title: { ar: "ط·ط±ظٹظ‚ط© ط§ظ„ط¨ط±ظٹط§ظ†ظٹ ط§ظ„ط£طµظ„ظٹ", en: "Authentic Biryani Method" },
    cook: "ط£ط¨ظˆ ظƒط±ط§ط±",
    image:
      "https://images.pexels.com/photos/32986475/pexels-photo-32986475.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "ط®ظ…ط³ط© ظ…ظٹظ„",
    price: 35000,
    rating: 4.8,
    buyers: 78,
    secret: { ar: "ط·ط±ظٹظ‚ط© ط·ظ‡ظٹ ط§ظ„ط£ط±ط²", en: "Rice cooking method" },
    category: "ط£ط±ط²",
  },
  {
    id: 3,
    title: { ar: "ط³ط± ط§ظ„ط²ظ„ط§ط¨ظٹط© ط§ظ„ظ…ظ‚ط±ظ…ط´ط©", en: "Crispy Zalabia Secret" },
    cook: "ط³طھ ظ†ظˆط±ظٹط©",
    image:
      "https://images.pexels.com/photos/31786489/pexels-photo-31786489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "ط§ظ„ط¬ط¨ظٹظ„ط©",
    price: 25000,
    rating: 5.0,
    buyers: 120,
    secret: { ar: "ط®ظ„ط·ط© ط§ظ„ط¹ط¬ظٹظ†", en: "Dough mix" },
    category: "ط­ظ„ظˆظٹط§طھ",
  },
  {
    id: 4,
    title: { ar: "ط³ط± ط§ظ„طھط´ط±ظٹط¨ ط§ظ„ط¨طµط±ظٹ", en: "Basra Tashreeb Secret" },
    cook: "ط£ظ… ط³ظٹظپ",
    image:
      "https://images.pexels.com/photos/38301350/pexels-photo-38301350.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "ط§ظ„ط¬ط²ط§ط¦ط±",
    price: 30000,
    rating: 4.7,
    buyers: 56,
    secret: { ar: "ط·ط±ظٹظ‚ط© ط§ظ„ظ…ط±ظ‚", en: "Broth method" },
    category: "ط£ط·ط¨ط§ظ‚ ط±ط¦ظٹط³ظٹط©",
  },
  {
    id: 5,
    title: { ar: "ط³ط± ط§ظ„ظƒط¨ط§ط¨ ط§ظ„ط¨طµط±ظٹ", en: "Basra Kebab Secret" },
    cook: "ط£ط¨ظˆ ط­ط³ظٹظ†",
    image:
      "https://images.pexels.com/photos/32986489/pexels-photo-32986489.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "ط§ظ„ط²ط¨ظٹط±",
    price: 40000,
    rating: 4.8,
    buyers: 92,
    secret: { ar: "ط®ظ„ط·ط© ط§ظ„ظ„ط­ظ…", en: "Meat mix" },
    category: "ظ…ط´ط§ظˆظٹ",
  },
];

export default function SecretRecipeMarket() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(MOCK_RECIPES.map((r) => r.category))),
  ];

  const filteredRecipes = MOCK_RECIPES.filter((recipe) => {
    const matchSearch =
      recipe.title.ar.includes(search) ||
      recipe.title.en.toLowerCase().includes(search.toLowerCase()) ||
      recipe.cook.includes(search);
    const matchCategory = category === "all" || recipe.category === category;
    return matchSearch && matchCategory;
  });

  const handleBuy = (recipe) => {
    toast.success(
      t(
        `طھظ… ط´ط±ط§ط، "${recipe.title.ar}" ط¨ظ†ط¬ط§ط­!`,
        `"${recipe.title.en}" purchased successfully!`,
      ),
    );
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #8B6914, #C9A227)" }}
        >
          <BookOpen size={40} style={{ color: "#FFFFFF" }} />
        </div>
        <h1 className="font-ruqaa text-5xl text-gradient-gold text-glow-gold mb-3">
          {t("ط³ظˆظ‚ ط§ظ„ظˆطµظپط§طھ ط§ظ„ط³ط±ظٹط©", "Secret Recipe Market")}
        </h1>
        <p
          className="font-tajawal text-lg max-w-2xl mx-auto"
          style={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          {t(
            "ط§ط´طھط±ظگ ط£ط³ط±ط§ط± ط§ظ„ط·ظڈظ‡ط§ط© ط§ظ„ظ…ط­طھط±ظپظٹظ† â€” ظˆطµظپط§طھ ط­طµط±ظٹط© ظ„ط§ طھط¬ط¯ظ‡ط§ ظپظٹ ط£ظٹ ظ…ظƒط§ظ† ط¢ط®ط±",
            "Buy secrets from professional chefs â€” exclusive recipes you won't find anywhere else",
          )}
        </p>
      </motion.div>

      {/* ط§ظ„ط¨ط­ط« + ط§ظ„ظپط¦ط§طھ */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{ color: "rgba(201, 162, 39, 0.6)" }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("ط§ط¨ط­ط« ط¹ظ† ظˆطµظپط©...", "Search recipe...")}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background:
                  category === cat
                    ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                    : "rgba(255, 255, 255, 0.08)",
                color:
                  category === cat ? "#0F2419" : "rgba(255, 255, 255, 0.7)",
                border:
                  category === cat
                    ? "none"
                    : "1px solid rgba(201, 162, 39, 0.25)",
              }}
            >
              {cat === "all" ? t("ط§ظ„ظƒظ„", "All") : cat}
            </button>
          ))}
        </div>
      </div>

      {/* ط§ظ„ط´ط¨ظƒط© */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen
            size={48}
            className="mx-auto mb-4"
            style={{ color: "rgba(201, 162, 39, 0.3)" }}
          />
          <p
            className="font-tajawal text-lg"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {t("ظ„ط§ طھظˆط¬ط¯ ظˆطµظپط§طھ", "No recipes")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))",
                border: "1px solid rgba(201, 162, 39, 0.2)",
              }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={recipe.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

                {/* Badge ط§ظ„طھظ‚ظٹظٹظ… */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(15, 36, 25, 0.9)",
                    border: "1px solid rgba(201, 162, 39, 0.4)",
                  }}
                >
                  <Star size={12} fill="#F5D76E" color="#F5D76E" />
                  <span
                    className="font-cairo text-xs"
                    style={{ color: "#F5D76E" }}
                  >
                    {recipe.rating}
                  </span>
                </div>

                {/* Badge ط§ظ„ظ‚ظپظ„ */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(201, 162, 39, 0.9)",
                    color: "#0F2419",
                  }}
                >
                  <Lock size={12} />
                  <span className="font-tajawal text-[10px] font-bold">
                    {t("ط­طµط±ظٹ", "Exclusive")}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-ruqaa text-xl text-gradient-gold mb-3">
                  {lang === "ar" ? recipe.title.ar : recipe.title.en}
                </h3>

                <div className="space-y-2 mb-4">
                  <div
                    className="flex items-center gap-2 font-tajawal text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    <ChefHat size={12} style={{ color: "#F5D76E" }} />{" "}
                    {recipe.cook}
                  </div>
                  <div
                    className="flex items-center gap-2 font-tajawal text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    <MapPin size={12} style={{ color: "#F5D76E" }} />{" "}
                    {recipe.area}
                  </div>
                </div>

                {/* ط§ظ„ط³ط± */}
                <div
                  className="p-3 rounded-xl mb-4 flex items-center gap-2"
                  style={{
                    background: "rgba(139, 105, 20, 0.15)",
                    border: "1px solid rgba(201, 162, 39, 0.3)",
                  }}
                >
                  <Lock size={14} style={{ color: "#F5D76E" }} />
                  <div className="flex-1">
                    <p
                      className="font-tajawal text-[10px]"
                      style={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
                      {t("ط§ظ„ط³ط±", "The Secret")}
                    </p>
                    <p
                      className="font-tajawal text-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {lang === "ar" ? recipe.secret.ar : recipe.secret.en}
                    </p>
                  </div>
                </div>

                {/* ط§ظ„ط¥ط­طµط§ط¦ظٹط§طھ */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="flex items-center gap-1 font-tajawal text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.6)" }}
                  >
                    <ShoppingBag size={12} /> {recipe.buyers}{" "}
                    {t("ظ…ط´طھط±ظچ", "buyers")}
                  </div>
                  <span className="font-cairo text-xl text-gradient-gold">
                    {formatPrice(recipe.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleBuy(recipe)}
                  className="w-full py-3 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #8B6914, #C9A227)",
                    color: "#FFFFFF",
                  }}
                >
                  <DollarSign size={16} /> {t("ط§ط´طھط±ظگ ط§ظ„ط³ط±", "Buy the Secret")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

