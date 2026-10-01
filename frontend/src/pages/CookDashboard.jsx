import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Package, Clock, Star, DollarSign } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import API from "@/services/api";
import CookStats from "@/components/cook/CookStats";
import CookBadge from "@/components/loyalty/CookBadge";
import MenuManager from "@/components/cook/MenuManager";
import ReviewsPanel from "@/components/cook/ReviewsPanel";
import EarningsPanel from "@/components/cook/EarningsPanel";

const STATUS_CONFIG = {
  pending: {
    ar: "طلب جديد",
    en: "New Order",
    color: "#F5D76E",
    bg: "rgba(201, 162, 39, 0.15)",
  },
  accepted: {
    ar: "تم القبول",
    en: "Accepted",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.15)",
  },
  preparing: {
    ar: "قيد التحضير",
    en: "Preparing",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.15)",
  },
  ready: {
    ar: "جاهز",
    en: "Ready",
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.15)",
  },
  delivered: {
    ar: "تم التسليم",
    en: "Delivered",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
  },
  rejected: {
    ar: "مرفوض",
    en: "Rejected",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
  },
  cancelled: {
    ar: "ملغى",
    en: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
  },
  scheduled: {
    ar: "مجدول",
    en: "Scheduled",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.15)",
  },
};

const VALID_TABS = ["orders", "menu", "reviews", "earnings"];

export default function CookDashboard() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState(
    VALID_TABS.includes(initialTab) ? initialTab : "orders"
  );

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);

      const response = await API.get("/orders/cook-orders");

      setOrders(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to load cook orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const urlTab = searchParams.get("tab");

    if (urlTab && VALID_TABS.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const changeStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);

      const message =
        error?.response?.data?.message ||
        (lang === "ar"
          ? "تعذر تحديث حالة الطلب"
          : "Failed to update order status");

      alert(message);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      selectedStatus === "all" || order.status === selectedStatus
  );

  const today = new Date();

  const todayOrders = orders.filter((order) => {
    if (!order.created_at) return false;

    const date = new Date(order.created_at);

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  const earningsToday = todayOrders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  const activeOrders = orders.filter((order) =>
    ["pending", "accepted", "preparing", "ready"].includes(order.status)
  );

  const completedOrders = orders.filter(
    (order) => order.status === "delivered"
  );

  const orderTabs = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "pending", ar: "جديدة", en: "New" },
    { key: "accepted", ar: "مقبولة", en: "Accepted" },
    { key: "preparing", ar: "قيد التحضير", en: "Preparing" },
    { key: "ready", ar: "جاهزة", en: "Ready" },
    { key: "delivered", ar: "تم التسليم", en: "Delivered" },
  ];

  const MAIN_TABS = [
    {
      key: "orders",
      ar: "الطلبات",
      en: "Orders",
      icon: Package,
    },
    {
      key: "menu",
      ar: "قائمتي",
      en: "My Menu",
      icon: ChefHat,
    },
    {
      key: "reviews",
      ar: "التقييمات",
      en: "Reviews",
      icon: Star,
    },
    {
      key: "earnings",
      ar: "الأرباح",
      en: "Earnings",
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-ruqaa text-4xl md:text-5xl text-gradient-gold mb-2 flex items-center gap-3">
              <ChefHat size={40} />

              {t("لوحة الطباخ", "Cook Dashboard")}
            </h1>

            <p
              className="font-tajawal text-base"
              style={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              {t(
                `مرحباً ${user?.name || ""}! إليك ملخص يومك`,
                `Welcome ${user?.name || ""}! Here's your day summary`
              )}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mb-8">
        <CookBadge ordersCount={orders.length} />
      </div>

      <CookStats
        ordersToday={todayOrders.length}
        earningsToday={earningsToday}
        rating={0}
        newCustomers={
          new Set(
            todayOrders
              .map((order) => order.customer_id)
              .filter(Boolean)
          ).size
        }
      />

      <div className="flex gap-2 mb-8 border-b border-gold/15 overflow-x-auto">
        {MAIN_TABS.map((tb) => {
          const Icon = tb.icon;
          const isActive = activeTab === tb.key;

          return (
            <button
              key={tb.key}
              onClick={() => handleTabChange(tb.key)}
              className="relative px-5 py-3 font-tajawal text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
              style={{
                color: isActive
                  ? "#F5D76E"
                  : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <Icon size={16} />

              {lang === "ar" ? tb.ar : tb.en}

              {isActive && (
                <motion.span
                  layoutId="cookMainTab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright"
                />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "menu" && <MenuManager />}

      {activeTab === "reviews" && <ReviewsPanel />}

      {activeTab === "earnings" && <EarningsPanel />}

      {activeTab === "orders" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-ruqaa text-2xl text-gradient-gold mb-4 flex items-center gap-2">
              <Package size={24} />

              {t("طلبات اليوم", "Today's Orders")}
            </h2>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {orderTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className="px-4 py-2 rounded-full font-tajawal text-sm font-bold whitespace-nowrap transition-all"
                  style={{
                    background:
                      selectedStatus === tab.key
                        ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                        : "rgba(255, 255, 255, 0.08)",
                    color:
                      selectedStatus === tab.key
                        ? "#0F2419"
                        : "rgba(255, 255, 255, 0.7)",
                    border:
                      selectedStatus === tab.key
                        ? "none"
                        : "1px solid rgba(201, 162, 39, 0.25)",
                  }}
                >
                  {lang === "ar" ? tab.ar : tab.en}
                </button>
              ))}
            </div>
          </motion.div>

          {loadingOrders ? (
            <div className="text-center py-16">
              <p className="font-tajawal text-cream/60">
                {t("جاري تحميل الطلبات...", "Loading orders...")}
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
                border: "1px solid rgba(201, 162, 39, 0.2)",
              }}
            >
              <Package
                size={48}
                className="mx-auto mb-4 text-gold/40"
              />

              <p className="font-tajawal text-cream/50">
                {t(
                  "لا توجد طلبات في هذه الفئة",
                  "No orders in this category"
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order, i) => {
                const status =
                  STATUS_CONFIG[order.status] ||
                  STATUS_CONFIG.pending;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl p-5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
                      border: "1px solid rgba(201, 162, 39, 0.2)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div>
                        <p
                          className="font-cairo text-base font-bold"
                          style={{ color: "#F5D76E" }}
                        >
                          #{order.id}
                        </p>

                        <p
                          className="font-tajawal text-xs mt-1"
                          style={{
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {order.customer_name || "Customer"}
                        </p>
                      </div>

                      <span
                        className="px-3 py-1 rounded-full text-xs font-tajawal font-bold"
                        style={{
                          background: status.bg,
                          color: status.color,
                          border: `1px solid ${status.color}40`,
                        }}
                      >
                        {lang === "ar" ? status.ar : status.en}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.notes ? (
                        <p
                          className="font-tajawal text-sm"
                          style={{
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          {order.notes}
                        </p>
                      ) : (
                        <p
                          className="font-tajawal text-sm"
                          style={{
                            color: "rgba(255, 255, 255, 0.4)",
                          }}
                        >
                          {t(
                            "لا توجد ملاحظات",
                            "No notes"
                          )}
                        </p>
                      )}
                    </div>

                    <p
                      className="font-tajawal text-xs mb-3 flex items-center gap-1"
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      <Clock size={12} />

                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString(
                            lang === "ar"
                              ? "ar-IQ"
                              : "en-US"
                          )
                        : "—"}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                      <span
                        className="font-tajawal text-xs"
                        style={{
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {t("المجموع", "Total")}
                      </span>

                      <span className="font-cairo text-lg text-gradient-gold">
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString()}{" "}
                        {t("د.ع", "IQD")}
                      </span>
                    </div>

                    {order.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            changeStatus(
                              order.id,
                              "accepted"
                            )
                          }
                          className="flex-1 py-2.5 rounded-xl font-tajawal text-sm font-bold transition-all"
                          style={{
                            background:
                              "linear-gradient(135deg, #C9A227, #F5D76E)",
                            color: "#0F2419",
                          }}
                        >
                          ✓{" "}
                          {t(
                            "قبول الطلب",
                            "Accept"
                          )}
                        </button>

                        <button
                          onClick={() =>
                            changeStatus(
                              order.id,
                              "rejected"
                            )
                          }
                          className="px-4 py-2.5 rounded-xl font-tajawal text-sm font-bold"
                          style={{
                            border:
                              "1px solid rgba(239, 68, 68, 0.4)",
                            color: "#f87171",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {order.status === "accepted" && (
                      <button
                        onClick={() =>
                          changeStatus(
                            order.id,
                            "preparing"
                          )
                        }
                        className="w-full mt-4 py-2.5 rounded-xl font-tajawal text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e0b, #F5D76E)",
                          color: "#0F2419",
                        }}
                      >
                        {t(
                          "بدء التحضير",
                          "Start Preparing"
                        )}
                      </button>
                    )}

                    {order.status === "preparing" && (
                      <button
                        onClick={() =>
                          changeStatus(
                            order.id,
                            "ready"
                          )
                        }
                        className="w-full mt-4 py-2.5 rounded-xl font-tajawal text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #22c55e, #16a34a)",
                          color: "#FFFFFF",
                        }}
                      >
                        ✓{" "}
                        {t(
                          "جاهز للتوصيل",
                          "Mark Ready"
                        )}
                      </button>
                    )}

                    {order.status === "ready" && (
                      <button
                        onClick={() =>
                          changeStatus(
                            order.id,
                            "delivered"
                          )
                        }
                        className="w-full mt-4 py-2.5 rounded-xl font-tajawal text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #8b5cf6, #a855f7)",
                          color: "#FFFFFF",
                        }}
                      >
                        ✓{" "}
                        {t(
                          "تم التسليم",
                          "Mark Delivered"
                        )}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
