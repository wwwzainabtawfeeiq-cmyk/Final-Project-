import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Package,
  Users,
  MapPin,
  Clock,
  Gift,
  HandHeart,
  Award,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";
import toast from "react-hot-toast";

const TYPE_CONFIG = {
  surplus: {
    ar: "الفائض",
    en: "Surplus",
    color: "#F5D76E",
    icon: Package,
  },
  donation: {
    ar: "تبرع",
    en: "Donation",
    color: "#ef4444",
    icon: Heart,
  },
};

export default function SurplusAndCharityPage() {
  const { t, lang } = useLanguage();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);

        const response = await API.get("/food-rescue");
        const offers = response.data?.offers || [];

        const mappedOffers = offers.map((offer) => ({
          ...offer,
          type: offer.type === "donation" ? "donation" : "surplus",

          title: {
            ar: offer.meal_name || "فائض غذائي",
            en: offer.meal_name || "Food Rescue",
          },

          cook:
            offer.cook_name ||
            offer.cookName ||
            (offer.cook_id ? `Cook #${offer.cook_id}` : ""),

          area:
            offer.area ||
            offer.location ||
            "Basra",

          portions: Number(
            offer.remaining_quantity ||
              offer.quantity ||
              0
          ),

          expiresIn: offer.pickup_deadline
            ? new Date(offer.pickup_deadline).toLocaleString(
                lang === "ar" ? "ar-IQ" : "en-US"
              )
            : "",

          image:
            offer.image ||
            offer.image_url ||
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
        }));

        setItems(mappedOffers);
      } catch (error) {
        console.error("Failed to load food rescue offers:", error);

        toast.error(
          t(
            "تعذر تحميل العروض",
            "Failed to load offers"
          )
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [t, lang]);

  const filteredItems = items.filter((item) => {
    const title =
      lang === "ar"
        ? item.title?.ar || item.meal_name || item.name || ""
        : item.title?.en || item.meal_name || item.name || "";

    const cook =
      item.cook ||
      item.cook_name ||
      item.cookName ||
      "";

    const type = item.type || "surplus";

    const searchValue = search.toLowerCase();

    const matchFilter =
      filter === "all" || type === filter;

    const matchSearch =
      String(title)
        .toLowerCase()
        .includes(searchValue) ||
      String(cook)
        .toLowerCase()
        .includes(searchValue);

    return matchFilter && matchSearch;
  });

  const handleClaim = async (item) => {
    try {
      await API.post(
        `/food-rescue/${item.id}/claim`,
        {
          quantity: 1,
        }
      );

      toast.success(
        t(
          "تم استلام الوجبة بنجاح",
          "Meal claimed successfully"
        )
      );

      setItems((prev) =>
        prev
          .map((offer) => {
            if (offer.id !== item.id) {
              return offer;
            }

            const remaining = Math.max(
              0,
              Number(
                offer.remaining_quantity ||
                  offer.portions ||
                  0
              ) - 1
            );

            return {
              ...offer,
              remaining_quantity: remaining,
              portions: remaining,
            };
          })
          .filter(
            (offer) =>
              Number(
                offer.remaining_quantity ||
                  offer.portions ||
                  0
              ) > 0
          )
      );
    } catch (error) {
      console.error(
        "Claim food rescue offer error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          t(
            "تعذر استلام الوجبة",
            "Unable to claim meal"
          )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-center">
        <p className="font-tajawal text-lg text-gold-bright">
          {t(
            "جاري التحميل...",
            "Loading..."
          )}
        </p>
      </div>
    );
  }

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
          style={{
            background:
              "linear-gradient(135deg, #ef4444, #dc2626)",
          }}
        >
          <HandHeart
            size={40}
            style={{ color: "#FFFFFF" }}
          />
        </div>

        <h1 className="font-ruqaa text-5xl text-gradient-gold text-glow-gold mb-3">
          {t(
            "الفائض والخير",
            "Surplus & Charity"
          )}
        </h1>

        <p
          className="font-tajawal text-lg max-w-2xl mx-auto"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          {t(
            "ساعدنا في تقليل هدر الطعام — شارك فائض الطعام أو تبرع بالوجبات للمحتاجين",
            "Help us reduce food waste — share surplus food or donate meals to those in need."
          )}
        </p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
        {[
          {
            icon: Package,
            label: t(
              "وجبات فائضة",
              "Surplus meals"
            ),
            value: 156,
            color: "#F5D76E",
          },
          {
            icon: Heart,
            label: t(
              "وجبات متبرع بها",
              "Donated meals"
            ),
            value: 89,
            color: "#ef4444",
          },
          {
            icon: Users,
            label: t(
              "المستفيدون",
              "Beneficiaries"
            ),
            value: 234,
            color: "#22c55e",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.1,
              }}
              className="rounded-2xl p-4 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))",
                border:
                  "1px solid rgba(201, 162, 39, 0.2)",
              }}
            >
              <Icon
                size={24}
                className="mx-auto mb-2"
                style={{
                  color: stat.color,
                }}
              />

              <p
                className="font-cairo text-2xl font-bold"
                style={{
                  color: "#FFFFFF",
                }}
              >
                {stat.value}
              </p>

              <p
                className="font-tajawal text-xs"
                style={{
                  color:
                    "rgba(255, 255, 255, 0.6)",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

        <div className="relative flex-1 max-w-xs">
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 right-3"
            style={{
              color:
                "rgba(201, 162, 39, 0.6)",
            }}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder={t(
              "ابحث عن وجبة أو طباخ...",
              "Search meal or cook..."
            )}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>

        <div className="flex gap-2">
          {[
            {
              key: "all",
              ar: "الكل",
              en: "All",
            },
            {
              key: "surplus",
              ar: "الفائض",
              en: "Surplus",
            },
            {
              key: "donation",
              ar: "التبرعات",
              en: "Donations",
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() =>
                setFilter(f.key)
              }
              className="px-4 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background:
                  filter === f.key
                    ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                    : "rgba(255, 255, 255, 0.08)",

                color:
                  filter === f.key
                    ? "#0F2419"
                    : "rgba(255, 255, 255, 0.7)",

                border:
                  filter === f.key
                    ? "none"
                    : "1px solid rgba(201, 162, 39, 0.25)",
              }}
            >
              {lang === "ar"
                ? f.ar
                : f.en}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Package
            size={48}
            className="mx-auto mb-4"
            style={{
              color:
                "rgba(201, 162, 39, 0.3)",
            }}
          />

          <p
            className="font-tajawal text-lg"
            style={{
              color:
                "rgba(255, 255, 255, 0.6)",
            }}
          >
            {t(
              "لا توجد عناصر",
              "No items"
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredItems.map((item, i) => {
            const typeConf =
              TYPE_CONFIG[item.type] ||
              TYPE_CONFIG.surplus;

            const TypeIcon =
              typeConf.icon;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.08,
                }}
                className="rounded-3xl overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 36, 25, 0.9), rgba(27, 67, 50, 0.6))",
                  border:
                    `1px solid ${typeConf.color}40`,
                }}
              >

                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={
                      lang === "ar"
                        ? item.title?.ar || "وجبة"
                        : item.title?.en || "Meal"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-transparent to-transparent" />

                  {/* Type Badge */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tajawal font-bold"
                    style={{
                      background:
                        `${typeConf.color}E6`,
                      color: "#0F2419",
                    }}
                  >
                    <TypeIcon size={12} />

                    {lang === "ar"
                      ? typeConf.ar
                      : typeConf.en}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">

                  <h3 className="font-ruqaa text-xl text-gradient-gold mb-2">
                    {lang === "ar"
                      ? item.title?.ar
                      : item.title?.en}
                  </h3>

                  <div className="space-y-2 mb-4">

                    <div
                      className="flex items-center gap-2 font-tajawal text-xs"
                      style={{
                        color:
                          "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <span aria-hidden="true">
                        👨‍🍳
                      </span>

                      {item.cook ||
                        item.cook_name ||
                        item.cookName ||
                        ""}
                    </div>

                    <div
                      className="flex items-center gap-2 font-tajawal text-xs"
                      style={{
                        color:
                          "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <MapPin
                        size={12}
                        style={{
                          color: "#F5D76E",
                        }}
                      />

                      {item.area ||
                        item.location ||
                        ""}
                    </div>

                    <div
                      className="flex items-center gap-2 font-tajawal text-xs"
                      style={{
                        color:
                          "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <Clock
                        size={12}
                        style={{
                          color: "#F5D76E",
                        }}
                      />

                      {t(
                        "ينتهي بعد",
                        "Expires in"
                      )}

                      {" "}

                      {item.expiresIn ||
                        item.expires_in ||
                        item.expiry ||
                        ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gold/10 mb-4">

                    <span
                      className="font-tajawal text-xs"
                      style={{
                        color:
                          "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {t(
                        "الكمية",
                        "Portions"
                      )}
                    </span>

                    <span className="font-cairo text-lg text-gradient-gold">
                      {item.portions ||
                        item.quantity ||
                        0}{" "}

                      {t(
                        "وجبات",
                        "meals"
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleClaim(item)
                    }
                    className="w-full py-3 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{
                      background:
                        item.type === "donation"
                          ? "linear-gradient(135deg, #ef4444, #dc2626)"
                          : "linear-gradient(135deg, #C9A227, #F5D76E)",

                      color:
                        item.type === "donation"
                          ? "#FFFFFF"
                          : "#0F2419",
                    }}
                  >
                    {item.type === "donation"
                      ? t(
                          "استلام التبرع",
                          "Claim Donation"
                        )
                      : t(
                          "احصل على الفائض",
                          "Get Surplus"
                        )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="mt-16 rounded-3xl p-10 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1B4332 0%, #0F2419 100%)",
          border:
            "1px solid rgba(201, 162, 39, 0.3)",
        }}
      >
        <Award
          size={48}
          className="mx-auto mb-4"
          style={{
            color: "#F5D76E",
          }}
        />

        <h2 className="font-ruqaa text-3xl text-gradient-gold mb-3">
          {t(
            "هل لديك طعام فائض؟",
            "Do you have surplus food?"
          )}
        </h2>

        <p
          className="font-tajawal mb-6 max-w-xl mx-auto"
          style={{
            color:
              "rgba(255, 255, 255, 0.7)",
          }}
        >
          {t(
            "شارك فائض الطعام مع المحتاجين بدلًا من هدره. كل وجبة تصنع فرقًا.",
            "Share surplus food with those in need instead of wasting it. Every meal makes a difference."
          )}
        </p>

        <button
          className="px-8 py-4 rounded-full font-tajawal font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          style={{
            background:
              "linear-gradient(135deg, #C9A227, #F5D76E)",
            color: "#0F2419",
          }}
        >
          <Gift size={20} />

          {t(
            "تبرع الآن",
            "Donate Now"
          )}
        </button>
      </motion.div>
    </div>
  );
}
