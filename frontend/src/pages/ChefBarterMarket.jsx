import { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Search,
  MapPin,
  Package,
  ArrowLeftRight,
  Plus,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const MOCK_ITEMS = [
  {
    id: 1,
    title: { ar: "تمر خلاص - 5 كيلو", en: "Khalas Dates - 5kg" },
    cook: "أبو كرار",
    image:
      "https://images.pexels.com/photos/10865939/pexels-photo-10865939.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "خمسة ميل",
    lookingFor: { ar: "زيت زيتون", en: "Olive Oil" },
    postedAt: "منذ ساعة",
  },
  {
    id: 2,
    title: { ar: "بهارات بصري - 2 كيلو", en: "Basra Spices - 2kg" },
    cook: "أم أحمد",
    image:
      "https://images.pexels.com/photos/36796430/pexels-photo-36796430.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "العشار",
    lookingFor: { ar: "أرز بسمتي", en: "Basmati Rice" },
    postedAt: "منذ 3 ساعات",
  },
  {
    id: 3,
    title: { ar: "عسل جبلي - 1 كيلو", en: "Mountain Honey - 1kg" },
    cook: "ست نورية",
    image:
      "https://images.pexels.com/photos/3770002/pexels-photo-3770002.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "الجبيلة",
    lookingFor: { ar: "لحم غنم", en: "Lamb Meat" },
    postedAt: "منذ 5 ساعات",
  },
  {
    id: 4,
    title: { ar: "ليمون بصري - 3 كيلو", en: "Basra Lemons - 3kg" },
    cook: "أبو حسين",
    image:
      "https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg?auto=compress&cs=tinysrgb&h=400&w=400",
    area: "الزبير",
    lookingFor: { ar: "دجاج بلدي", en: "Local Chicken" },
    postedAt: "منذ 8 ساعات",
  },
];

export default function ChefBarterMarket() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");

  const filteredItems = MOCK_ITEMS.filter(
    (item) =>
      item.title.ar.includes(search) ||
      item.title.en.toLowerCase().includes(search.toLowerCase()) ||
      item.cook.includes(search),
  );

  const handleBarter = (item) => {
    toast.success(
      t(
        `تم إرسال طلب المقايضة إلى ${item.cook}`,
        `Barter request sent to ${item.cook}`,
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
          style={{ background: "linear-gradient(135deg, #C9A227, #F5D76E)" }}
        >
          <RefreshCw size={40} style={{ color: "#0F2419" }} />
        </div>
        <h1 className="font-ruqaa text-5xl text-gradient-gold text-glow-gold mb-3">
          {t("مقايضة الطباخين", "Chef Barter Market")}
        </h1>
        <p
          className="font-tajawal text-lg max-w-2xl mx-auto"
          style={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          {t(
            "قايض المكونات والأطباق مع الطُهاة الآخرين — وفّر المال واحصل على مكونات مميزة",
            "Exchange ingredients and dishes with other chefs — save money and get premium ingredients",
          )}
        </p>
      </motion.div>

      {/* البحث + زر الإضافة */}
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
            placeholder={t(
              "ابحث عن مكون أو طباخ...",
              "Search ingredient or chef...",
            )}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #C9A227, #F5D76E)",
            color: "#0F2419",
          }}
        >
          <Plus size={18} /> {t("أضف عرضك", "Post Your Offer")}
        </button>
      </div>

      {/* الشبكة */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Package
            size={48}
            className="mx-auto mb-4"
            style={{ color: "rgba(201, 162, 39, 0.3)" }}
          />
          <p
            className="font-tajawal text-lg"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {t("لا توجد عروض", "No offers")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
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
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

                {/* Badge الوقت */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-tajawal font-bold"
                  style={{
                    background: "rgba(15, 36, 25, 0.9)",
                    color: "#F5D76E",
                    border: "1px solid rgba(201, 162, 39, 0.4)",
                  }}
                >
                  <Clock size={10} /> {item.postedAt}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-ruqaa text-xl text-gradient-gold mb-3">
                  {lang === "ar" ? item.title.ar : item.title.en}
                </h3>

                <div className="space-y-2 mb-4">
                  <div
                    className="flex items-center gap-2 font-tajawal text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    👨‍🍳 {item.cook}
                  </div>
                  <div
                    className="flex items-center gap-2 font-tajawal text-xs"
                    style={{ color: "rgba(255, 255, 255, 0.7)" }}
                  >
                    <MapPin size={12} style={{ color: "#F5D76E" }} />{" "}
                    {item.area}
                  </div>
                </div>

                {/* المقابل */}
                <div
                  className="p-3 rounded-xl mb-4 flex items-center gap-2"
                  style={{
                    background: "rgba(201, 162, 39, 0.08)",
                    border: "1px solid rgba(201, 162, 39, 0.2)",
                  }}
                >
                  <ArrowLeftRight size={14} style={{ color: "#F5D76E" }} />
                  <div className="flex-1">
                    <p
                      className="font-tajawal text-[10px]"
                      style={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
                      {t("يبحث عن", "Looking for")}
                    </p>
                    <p
                      className="font-tajawal text-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {lang === "ar" ? item.lookingFor.ar : item.lookingFor.en}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBarter(item)}
                  className="w-full py-3 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #C9A227, #F5D76E)",
                    color: "#0F2419",
                  }}
                >
                  <RefreshCw size={16} /> {t("قايض الآن", "Barter Now")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
