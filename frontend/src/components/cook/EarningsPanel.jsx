import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Calendar,
  Award,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";

const formatPrice = (value) =>
  `${Number(value || 0).toLocaleString("en-US")} IQD`;

export default function EarningsPanel() {
  const { t, lang } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await API.get("/cook-insights");
        if (mounted) {
          setData(response.data?.data || null);
        }
      } catch (error) {
        console.error("Cook earnings error:", error);
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const statistics = data?.statistics || {};
  const meals = data?.meals || {};
  const topMeal = data?.top_meal || null;

  const stats = useMemo(
    () => [
      {
        icon: DollarSign,
        label: t("إجمالي المبيعات", "Total Sales"),
        value: formatPrice(statistics.total_sales),
        color: "#22c55e",
      },
      {
        icon: ShoppingBag,
        label: t("إجمالي الطلبات", "Total Orders"),
        value: Number(statistics.total_orders || 0).toLocaleString("en-US"),
        color: "#3b82f6",
      },
      {
        icon: Award,
        label: t("الطلبات المكتملة", "Completed Orders"),
        value: Number(statistics.completed_orders || 0).toLocaleString("en-US"),
        color: "#a855f7",
      },
      {
        icon: Star,
        label: t("متوسط التقييم", "Average Rating"),
        value: Number(statistics.average_rating || 0).toFixed(2),
        color: "#F5D76E",
      },
    ],
    [statistics, t]
  );

  if (loading) {
    return (
      <div className="rounded-2xl p-8 text-center text-white/60">
        {t("جاري تحميل بيانات الأرباح...", "Loading earnings data...")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))",
                border: "1px solid rgba(201, 162, 39, 0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}40, ${stat.color}20)`,
                  border: `1px solid ${stat.color}60`,
                }}
              >
                <Icon size={22} style={{ color: stat.color }} />
              </div>

              <p
                className="font-tajawal text-xs mb-1"
                style={{ color: "rgba(255,255,255,.6)" }}
              >
                {stat.label}
              </p>

              <p className="font-cairo text-xl font-bold text-white">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,36,25,.8), rgba(27,67,50,.5))",
            border: "1px solid rgba(201,162,39,.2)",
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-4 flex items-center gap-2">
            <Wallet size={20} />
            {t("إحصائيات القائمة", "Menu Statistics")}
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-4 bg-white/5 text-center">
              <p className="text-white text-xl font-bold">
                {meals.total_meals || 0}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {t("كل الوجبات", "All Meals")}
              </p>
            </div>

            <div className="rounded-xl p-4 bg-white/5 text-center">
              <p className="text-white text-xl font-bold">
                {meals.available_meals || 0}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {t("متاحة", "Available")}
              </p>
            </div>

            <div className="rounded-xl p-4 bg-white/5 text-center">
              <p className="text-white text-xl font-bold">
                {meals.low_stock_meals || 0}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {t("كمية قليلة", "Low Stock")}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,36,25,.8), rgba(27,67,50,.5))",
            border: "1px solid rgba(201,162,39,.2)",
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-4 flex items-center gap-2">
            <Calendar size={20} />
            {t("ملخص الأرباح", "Sales Summary")}
          </h3>

          <p className="font-cairo text-4xl font-bold text-gradient-gold mb-2">
            {formatPrice(statistics.total_sales)}
          </p>

          <p className="font-tajawal text-sm text-white/60">
            {t(
              "إجمالي المبيعات من الطلبات المكتملة",
              "Total sales from delivered orders"
            )}
          </p>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-white/60">
              {t("الطلبات الملغاة", "Cancelled Orders")}
            </span>
            <span className="text-white font-bold">
              {statistics.cancelled_orders || 0}
            </span>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,36,25,.8), rgba(27,67,50,.5))",
          border: "1px solid rgba(201,162,39,.2)",
        }}
      >
        <h3 className="font-ruqaa text-xl text-gradient-gold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          {t("أكثر وجبة مبيعاً", "Top Selling Meal")}
        </h3>

        {topMeal ? (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-cairo font-bold"
              style={{
                background:
                  "linear-gradient(135deg, #C9A227, #F5D76E)",
                color: "#0F2419",
              }}
            >
              1
            </div>

            <div className="flex-1">
              <p className="font-tajawal font-bold text-white">
                {topMeal.name}
              </p>

              <p className="font-tajawal text-xs mt-1 text-white/50">
                {Number(topMeal.sold_quantity || 0).toLocaleString("en-US")}{" "}
                {t("طلب/وحدة مباعة", "units sold")}
              </p>
            </div>

            <span className="font-cairo text-base text-gradient-gold">
              {formatPrice(topMeal.sales)}
            </span>
          </div>
        ) : (
          <p className="text-white/50">
            {t("لا توجد بيانات مبيعات حالياً", "No sales data available yet")}
          </p>
        )}
      </div>

      {data?.insights?.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,36,25,.8), rgba(27,67,50,.5))",
            border: "1px solid rgba(201,162,39,.2)",
          }}
        >
          <h3 className="font-ruqaa text-xl text-gradient-gold mb-4">
            {t("ملاحظات الأداء", "Performance Insights")}
          </h3>

          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-white/5 text-white/80 font-tajawal text-sm"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
