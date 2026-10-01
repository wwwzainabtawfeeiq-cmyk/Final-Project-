import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  Package,
  Star,
  X,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getMyOrders } from "@/services/orderService";
import { createReview } from "@/services/reviewService";

const STATUS_LABELS = {
  pending: { ar: "قيد الانتظار", en: "Pending", color: "text-blue-400 bg-blue-500/10" },
  accepted: { ar: "تم قبول الطلب", en: "Accepted", color: "text-blue-400 bg-blue-500/10" },
  preparing: { ar: "قيد التحضير", en: "Preparing", color: "text-yellow-400 bg-yellow-500/10" },
  ready: { ar: "جاهز", en: "Ready", color: "text-orange-400 bg-orange-500/10" },
  delivered: { ar: "تم التسليم", en: "Delivered", color: "text-green-400 bg-green-500/10" },
  cancelled: { ar: "ملغى", en: "Cancelled", color: "text-red-400 bg-red-500/10" },
  rejected: { ar: "مرفوض", en: "Rejected", color: "text-red-400 bg-red-500/10" },
};

export default function OrdersPage() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response?.data || response || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (tab === "active") {
      return ["pending", "accepted", "preparing", "ready"].includes(order.status);
    }

    if (tab === "past") {
      return order.status === "delivered";
    }

    return ["cancelled", "rejected"].includes(order.status);
  });

  const TABS = [
    { key: "active", ar: "الحالية", en: "Active" },
    { key: "past", ar: "السابقة", en: "Past" },
    { key: "cancelled", ar: "الملغاة", en: "Cancelled" },
  ];

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-ruqaa text-5xl text-center text-gradient-gold mb-8"
      >
        {t("طلباتي", "My Orders")}
      </motion.h1>

      <div className="flex justify-center gap-2 mb-8 border-b border-gold/15">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className="relative px-6 py-3 font-tajawal text-sm transition-colors"
            style={{
              color: tab === tb.key ? "#F5D76E" : "rgba(255,255,255,.5)",
              fontWeight: tab === tb.key ? "bold" : "normal",
            }}
          >
            {lang === "ar" ? tb.ar : tb.en}

            {tab === tb.key && (
              <motion.span
                layoutId="ordersTabUnderline"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-gold-bright"
              />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-cream/60 font-tajawal">
          {t("جاري تحميل الطلبات...", "Loading orders...")}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-gold/30 mx-auto mb-4" />
          <p className="font-tajawal text-cream/60 text-lg">
            {t("لا توجد طلبات هنا", "No orders here")}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order, i) => (
            <OrderCard
              key={order.id}
              order={order}
              index={i}
              onReview={() => setReviewOrder(order)}
              lang={lang}
              t={t}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {reviewOrder && (
          <ReviewModal
            order={reviewOrder}
            onClose={() => setReviewOrder(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderCard({ order, index, onReview, lang, t }) {
  const navigate = useNavigate();

  const status =
    STATUS_LABELS[order.status] || {
      ar: order.status,
      en: order.status,
      color: "text-white/60 bg-white/10",
    };

  const orderItems = order.items || order.order_items || [];
  const canTrack = ["pending", "accepted", "preparing", "ready"].includes(
    order.status
  );
  const canReview = order.status === "delivered";

  const total = Number(order.total_amount ?? order.total ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-light rounded-2xl p-6 cursor-pointer hover:border-gold-bright transition-all"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-cairo text-lg text-[#F5D76E]">
            #{order.id}
          </h3>

          <p className="font-tajawal text-sm flex items-center gap-1 mt-1 text-white/60">
            <Clock size={14} />
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : ""}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-tajawal font-bold ${status.color}`}
        >
          {lang === "ar" ? status.ar : status.en}
        </div>
      </div>

      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
        {orderItems.slice(0, 5).map((item, i) => {
          const meal = item.meal || item;
          const mealName =
            item.meal_name ||
            meal.name ||
            `Meal ${item.meal_id || i + 1}`;

          return (
            <div
              key={item.id || `${order.id}-${i}`}
              className="flex items-center gap-2 shrink-0 glass rounded-xl p-2"
            >
              {item.image_url || meal.image ? (
                <img
                  src={item.image_url || meal.image}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Package size={20} className="text-gold/50" />
                </div>
              )}

              <span className="font-tajawal text-sm text-white/90 max-w-[140px] truncate">
                {mealName}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gold/10">
        <div>
          <span className="font-tajawal text-sm text-white/60">
            {orderItems.length} {t("أطباق", "items")}
          </span>

          {order.chef_name && (
            <span className="block font-tajawal text-xs mt-1 text-white/50">
              👨‍🍳 {order.chef_name}
            </span>
          )}
        </div>

        <span className="font-cairo text-xl text-gradient-gold">
          {total.toLocaleString()} IQD
        </span>
      </div>

      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
        {canTrack && (
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-tajawal text-sm font-bold"
            style={{
              background: "linear-gradient(135deg,#C9A227,#F5D76E)",
              color: "#0F2419",
            }}
          >
            <Eye size={16} />
            {t("تتبع الطلب", "Track Order")}
          </button>
        )}

        {canReview && (
          <button
            onClick={onReview}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-tajawal text-sm font-bold"
            style={{
              border: "1px solid #F5D76E",
              color: "#F5D76E",
              backgroundColor: "rgba(201,162,39,.1)",
            }}
          >
            <Star size={16} />
            {t("قيّم الطلب", "Rate Order")}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ReviewModal({ order, onClose, t }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const items = order.items || order.order_items || [];
  const firstItem = items[0] || {};
  const mealId = firstItem.meal_id || firstItem.meal?.id;
  const cookId = firstItem.cook_id || firstItem.meal?.cook_id || order.chef_id;

  const handleSubmit = async () => {
    if (!mealId || !cookId) return;

    try {
      setSaving(true);

      await createReview({
        order_id: order.id,
        meal_id: mealId,
        cook_id: cookId,
        rating,
        comment,
      });

      setSubmitted(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0F2419 0%,#1B4332 100%)",
          border: "2px solid rgba(201,162,39,.4)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/10"
        >
          <X size={18} className="text-[#F5D76E]" />
        </button>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle size={50} className="mx-auto mb-4 text-[#F5D76E]" />
              <h2 className="font-ruqaa text-3xl text-gradient-gold">
                {t("شكراً لك!", "Thank You!")}
              </h2>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <Star size={40} className="mx-auto mb-2 text-[#F5D76E]" />
                <h2 className="font-ruqaa text-2xl text-gradient-gold">
                  {t("قيّم تجربتك", "Rate your experience")}
                </h2>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star
                      size={36}
                      className={
                        star <= rating
                          ? "text-[#F5D76E] fill-[#F5D76E]"
                          : "text-white/20"
                      }
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder={t(
                  "شاركنا تجربتك...",
                  "Share your experience..."
                )}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-xl p-3 bg-white/10 text-white border border-gold/30 outline-none"
              />

              <button
                disabled={saving || !mealId || !cookId}
                onClick={handleSubmit}
                className="w-full mt-6 py-3.5 rounded-full font-tajawal font-bold disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#C9A227,#F5D76E)",
                  color: "#0F2419",
                }}
              >
                {saving
                  ? t("جاري الإرسال...", "Submitting...")
                  : t("إرسال التقييم", "Submit Review")}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
