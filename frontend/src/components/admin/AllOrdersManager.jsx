import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  CheckCircle,
  Truck,
  ChefHat,
  Package,
  Search,
  X,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";

const STATUS_CONFIG = {
  pending: {
    ar: "قيد الانتظار",
    en: "Pending",
    color: "#3b82f6",
    icon: Clock,
  },
  accepted: {
    ar: "مقبول",
    en: "Accepted",
    color: "#06b6d4",
    icon: CheckCircle,
  },
  preparing: {
    ar: "قيد التحضير",
    en: "Preparing",
    color: "#F5D76E",
    icon: ChefHat,
  },
  ready: {
    ar: "جاهز",
    en: "Ready",
    color: "#f97316",
    icon: Package,
  },
  delivering: {
    ar: "قيد التوصيل",
    en: "Delivering",
    color: "#a855f7",
    icon: Truck,
  },
  delivered: {
    ar: "تم التسليم",
    en: "Delivered",
    color: "#22c55e",
    icon: CheckCircle,
  },
  rejected: {
    ar: "مرفوض",
    en: "Rejected",
    color: "#ef4444",
    icon: X,
  },
  cancelled: {
    ar: "ملغى",
    en: "Cancelled",
    color: "#ef4444",
    icon: X,
  },
  scheduled: {
    ar: "مجدول",
    en: "Scheduled",
    color: "#8b5cf6",
    icon: Clock,
  },
};

export default function AllOrdersManager() {
  const { t, lang } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const response = await API.get("/admin/orders");

        setOrders(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to load admin orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchFilter =
        filter === "all" || order.status === filter;

      const searchable = [
        order.id,
        order.customer_name,
        order.customer_email,
        order.cook_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch =
        !query || searchable.includes(query);

      return matchFilter && matchSearch;
    });
  }, [orders, filter, search]);

  const filters = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "pending", ar: "قيد الانتظار", en: "Pending" },
    { key: "accepted", ar: "مقبولة", en: "Accepted" },
    { key: "preparing", ar: "قيد التحضير", en: "Preparing" },
    { key: "ready", ar: "جاهزة", en: "Ready" },
    { key: "delivered", ar: "تم التسليم", en: "Delivered" },
    { key: "cancelled", ar: "ملغاة", en: "Cancelled" },
  ];

  const formatPrice = (value) =>
    `${Number(value || 0).toLocaleString()} ${t("د.ع", "IQD")}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2">
          <ShoppingBag size={24} />
          {t("كل الطلبات", "All Orders")}
        </h2>

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
              "ابحث برقم الطلب أو الاسم...",
              "Search order or customer..."
            )}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className="px-3 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
            style={{
              background:
                filter === item.key
                  ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                  : "rgba(255, 255, 255, 0.08)",
              color:
                filter === item.key
                  ? "#0F2419"
                  : "rgba(255, 255, 255, 0.7)",
            }}
          >
            {lang === "ar" ? item.ar : item.en}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="font-tajawal text-white/50">
            {t("جاري تحميل الطلبات...", "Loading orders...")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, i) => {
            const status =
              STATUS_CONFIG[order.status] ||
              STATUS_CONFIG.pending;

            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
                  border:
                    "1px solid rgba(201, 162, 39, 0.2)",
                }}
              >
                <div className="md:col-span-2">
                  <p
                    className="font-cairo text-sm font-bold"
                    style={{ color: "#F5D76E" }}
                  >
                    #{order.id}
                  </p>

                  <p
                    className="font-cairo text-xs mt-1"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleDateString(
                          lang === "ar"
                            ? "ar-IQ"
                            : "en-US"
                        )
                      : "—"}
                  </p>
                </div>

                <div className="md:col-span-3">
                  <p
                    className="font-tajawal text-sm"
                    style={{ color: "#FFFFFF" }}
                  >
                    👤 {order.customer_name || "—"}
                  </p>

                  <p
                    className="font-tajawal text-xs mt-1"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    👨‍🍳 {order.cook_name || "—"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p
                    className="font-tajawal text-xs"
                    style={{
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {order.items_count || 0}{" "}
                    {t("أطباق", "items")}
                  </p>

                  {order.order_type && (
                    <p
                      className="font-tajawal text-xs mt-1"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {order.order_type}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-tajawal font-bold"
                    style={{
                      background: `${status.color}20`,
                      color: status.color,
                      border: `1px solid ${status.color}40`,
                    }}
                  >
                    <StatusIcon size={12} />
                    {lang === "ar"
                      ? status.ar
                      : status.en}
                  </span>
                </div>

                <div className="md:col-span-3 text-left">
                  <span className="font-cairo text-lg text-gradient-gold">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="py-16 text-center">
              <p
                className="font-tajawal"
                style={{
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {t("لا توجد طلبات", "No orders")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
