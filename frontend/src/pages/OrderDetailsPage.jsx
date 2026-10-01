import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  Package,
  Truck,
  ChefHat,
  Star,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  X,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getOrder } from "@/services/orderService";
import { createReview } from "@/services/reviewService";

const TRACKING_STEPS = [
  { key: "pending", ar: "تم استلام الطلب", en: "Order Received", icon: CheckCircle },
  { key: "accepted", ar: "تم قبول الطلب", en: "Accepted", icon: CheckCircle },
  { key: "preparing", ar: "قيد التحضير", en: "Preparing", icon: ChefHat },
  { key: "ready", ar: "جاهز للتوصيل", en: "Ready", icon: Package },
  { key: "delivered", ar: "تم التسليم", en: "Delivered", icon: CheckCircle },
];

const STATUS_INDEX = {
  pending: 0,
  accepted: 1,
  preparing: 2,
  ready: 3,
  delivered: 4,
  cancelled: -1,
  rejected: -1,
};

const STATUS_LABELS = {
  pending: { ar: "قيد الانتظار", en: "Pending", color: "#3b82f6" },
  accepted: { ar: "تم قبول الطلب", en: "Accepted", color: "#3b82f6" },
  preparing: { ar: "قيد التحضير", en: "Preparing", color: "#F5D76E" },
  ready: { ar: "جاهز", en: "Ready", color: "#f97316" },
  delivered: { ar: "تم التسليم", en: "Delivered", color: "#22c55e" },
  cancelled: { ar: "ملغى", en: "Cancelled", color: "#ef4444" },
  rejected: { ar: "مرفوض", en: "Rejected", color: "#ef4444" },
};

const formatPrice = (value) =>
  `${Number(value || 0).toLocaleString("en-US")} IQD`;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrder(id);
        setOrder(response?.data || response || null);
      } catch (err) {
        console.error("Failed to load order:", err);
        setOrder(null);
        setError(
          lang === "ar"
            ? "تعذر تحميل تفاصيل الطلب"
            : "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-tajawal text-white/60">
          {t("جاري تحميل الطلب...", "Loading order...")}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-ruqaa text-3xl text-gradient-gold mb-4">
            {error || t("لم نجد هذا الطلب", "Order not found")}
          </h2>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 rounded-full font-tajawal font-bold"
            style={{
              background: "linear-gradient(135deg, #C9A227, #F5D76E)",
              color: "#0F2419",
            }}
          >
            {t("العودة للطلبات", "Back to Orders")}
          </Link>
        </div>
      </div>
    );
  }

  const status =
    STATUS_LABELS[order.status] || {
      ar: order.status,
      en: order.status,
      color: "#F5D76E",
    };

  const items = order.items || order.order_items || [];
  const currentIndex = STATUS_INDEX[order.status] ?? -1;
  const total = Number(order.total_amount ?? order.total ?? 0);

  const cookName =
    order.cook_name ||
    order.chef_name ||
    order.cook ||
    "Cook";

  const phone =
    order.cook_phone ||
    order.phone ||
    order.chef_phone ||
    "—";

  const address =
    order.address ||
    order.delivery_address ||
    order.address_text ||
    "—";

  const payment =
    order.payment_method ||
    order.payment ||
    "—";

  const canReview = order.status === "delivered";

  const firstItem = items[0] || {};
  const mealId = firstItem.meal_id || firstItem.meal?.id;
  const cookId =
    firstItem.cook_id ||
    firstItem.meal?.cook_id ||
    order.chef_id ||
    order.cook_id;

  const handleSubmitReview = async () => {
    if (!mealId || !cookId) return;

    try {
      setSavingReview(true);

      await createReview({
        order_id: order.id,
        meal_id: mealId,
        cook_id: cookId,
        rating,
        comment,
      });

      setSubmitted(true);

      setTimeout(() => {
        setReviewOpen(false);
        setSubmitted(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSavingReview(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 mb-6 font-tajawal text-sm hover:text-gold-bright transition-colors"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        <Arrow size={18} />
        {t("العودة للطلبات", "Back to Orders")}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 mb-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,36,25,0.9), rgba(27,67,50,0.6))",
          border: "1px solid rgba(201,162,39,0.3)",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1
              className="font-cairo text-3xl mb-1"
              style={{ color: "#F5D76E" }}
            >
              #{order.id}
            </h1>

            <p
              className="font-tajawal text-sm flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <Clock size={14} />
              {order.created_at
                ? new Date(order.created_at).toLocaleString(
                    lang === "ar" ? "ar-IQ" : "en-US"
                  )
                : "—"}
            </p>
          </div>

          <div
            className="px-5 py-2.5 rounded-full font-tajawal font-bold text-sm"
            style={{
              background: `${status.color}20`,
              color: status.color,
              border: `1px solid ${status.color}60`,
            }}
          >
            {lang === "ar" ? status.ar : status.en}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {items.map((item, index) => {
            const price = Number(item.price ?? item.unit_price ?? 0);
            const quantity = Number(item.quantity ?? 1);

            const image =
              item.image_url ||
              item.image ||
              "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80";

            const name =
              item.meal_name ||
              item.name ||
              item.meal?.name ||
              "Meal";

            return (
              <div
                key={item.id || index}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <img
                  src={image}
                  alt={name}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3
                    className="font-tajawal font-bold text-base"
                    style={{ color: "#FFFFFF" }}
                  >
                    {name}
                  </h3>

                  <p
                    className="font-tajawal text-xs mt-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {quantity} × {formatPrice(price)}
                  </p>
                </div>

                <span className="font-cairo text-lg text-gradient-gold">
                  {formatPrice(price * quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gold/15">
          <span className="font-tajawal text-lg text-white">
            {t("المجموع الكلي", "Grand Total")}
          </span>

          <span className="font-cairo text-2xl text-gradient-gold">
            {formatPrice(total)}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: ChefHat, label: t("الطباخ", "Cook"), value: cookName },
          { icon: Phone, label: t("الهاتف", "Phone"), value: phone },
          { icon: CreditCard, label: t("الدفع", "Payment"), value: payment },
        ].map((info, i) => {
          const Icon = info.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,36,25,0.8), rgba(27,67,50,0.5))",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(201,162,39,0.15)" }}
              >
                <Icon size={18} style={{ color: "#F5D76E" }} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-tajawal text-xs mb-0.5"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {info.label}
                </p>

                <p
                  className="font-tajawal text-sm truncate"
                  style={{ color: "#FFFFFF" }}
                >
                  {info.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className="rounded-2xl p-5 mb-6 flex items-start gap-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,36,25,0.8), rgba(27,67,50,0.5))",
          border: "1px solid rgba(201,162,39,0.2)",
        }}
      >
        <MapPin
          size={20}
          style={{ color: "#F5D76E" }}
          className="shrink-0 mt-0.5"
        />

        <div>
          <p
            className="font-tajawal text-xs mb-1"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {t("عنوان التوصيل", "Delivery address")}
          </p>

          <p className="font-tajawal text-sm text-white">{address}</p>
        </div>
      </div>

      {order.notes && (
        <div
          className="rounded-2xl p-5 mb-6 flex items-start gap-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,36,25,0.8), rgba(27,67,50,0.5))",
            border: "1px solid rgba(201,162,39,0.2)",
          }}
        >
          <FileText
            size={20}
            style={{ color: "#F5D76E" }}
            className="shrink-0 mt-0.5"
          />

          <div>
            <p
              className="font-tajawal text-xs mb-1"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {t("ملاحظاتك", "Your Notes")}
            </p>

            <p className="font-tajawal text-sm text-white">
              {order.notes}
            </p>
          </div>
        </div>
      )}

      {order.status !== "cancelled" && order.status !== "rejected" && (
        <div
          className="rounded-3xl p-6 mb-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,36,25,0.9), rgba(27,67,50,0.6))",
            border: "1px solid rgba(201,162,39,0.3)",
          }}
        >
          <h2 className="font-ruqaa text-2xl text-gradient-gold mb-6 flex items-center gap-2">
            <Truck size={24} />
            {t("تتبع الطلب", "Track Order")}
          </h2>

          <div className="space-y-4 relative">
            {TRACKING_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i <= currentIndex;
              const active = i === currentIndex;

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {i < TRACKING_STEPS.length - 1 && (
                    <div
                      className="absolute top-12 right-6 w-0.5 h-8 z-0"
                      style={{
                        backgroundColor:
                          i < currentIndex
                            ? "#F5D76E"
                            : "rgba(255,255,255,0.15)",
                      }}
                    />
                  )}

                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10"
                    style={{
                      background: done
                        ? "linear-gradient(135deg,#C9A227,#F5D76E)"
                        : "rgba(255,255,255,0.1)",
                      border: active ? "3px solid #F5D76E" : "none",
                      boxShadow: active
                        ? "0 0 20px rgba(201,162,39,0.6)"
                        : "none",
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: done ? "#0F2419" : "rgba(255,255,255,0.4)",
                      }}
                    />
                  </div>

                  <div className="flex-1 pt-2">
                    <h3
                      className="font-tajawal font-bold text-base"
                      style={{
                        color: done
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {lang === "ar" ? step.ar : step.en}
                    </h3>

                    {active && (
                      <p
                        className="font-tajawal text-xs mt-1"
                        style={{ color: "#F5D76E" }}
                      >
                        ● {t("الآن", "Now")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {canReview && (
          <button
            onClick={() => setReviewOpen(true)}
            className="flex-1 py-4 rounded-full font-tajawal font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              border: "2px solid #F5D76E",
              color: "#F5D76E",
              background: "rgba(201,162,39,0.1)",
            }}
          >
            <Star size={20} />
            {t("قيّم الطلب", "Rate Order")}
          </button>
        )}

        {canReview && (
          <button
            onClick={() => navigate("/meals")}
            className="flex-1 py-4 rounded-full font-tajawal font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg,#C9A227,#F5D76E)",
              color: "#0F2419",
            }}
          >
            <RotateCcw size={20} />
            {t("إعادة الطلب", "Reorder")}
          </button>
        )}
      </div>

      <AnimatePresence>
        {reviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick={() => setReviewOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg,#0F2419 0%,#1B4332 100%)",
                border: "2px solid rgba(201,162,39,0.4)",
                boxShadow: "0 25px 80px rgba(201,162,39,0.3)",
              }}
            >
              <button
                onClick={() => setReviewOpen(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <X size={18} style={{ color: "#F5D76E" }} />
              </button>

              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-10">
                    <CheckCircle
                      size={60}
                      className="mx-auto mb-4"
                      style={{ color: "#F5D76E" }}
                    />

                    <h2 className="font-ruqaa text-3xl text-gradient-gold mb-2">
                      {t("شكراً لك!", "Thank You!")}
                    </h2>

                    <p
                      className="font-tajawal text-sm"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {t("تم إرسال تقييمك بنجاح", "Your review was submitted")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <Star
                        size={40}
                        className="mx-auto mb-2"
                        style={{ color: "#F5D76E" }}
                      />

                      <h2 className="font-ruqaa text-2xl text-gradient-gold mb-1">
                        {t("قيّم تجربتك", "Rate your experience")}
                      </h2>

                      <p
                        className="font-tajawal text-sm"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {cookName}
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 mb-6">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            size={36}
                            style={{
                              color:
                                star <= rating
                                  ? "#F5D76E"
                                  : "rgba(255,255,255,0.2)",
                              fill:
                                star <= rating
                                  ? "#F5D76E"
                                  : "transparent",
                            }}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t(
                        "شاركنا تجربتك...",
                        "Share your experience..."
                      )}
                      className="w-full"
                      style={{
                        color: "#FFFFFF",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(201,162,39,0.35)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontFamily: "Tajawal,sans-serif",
                        fontSize: "16px",
                        outline: "none",
                        resize: "vertical",
                        minHeight: "90px",
                      }}
                    />

                    <button
                      onClick={handleSubmitReview}
                      disabled={savingReview}
                      className="w-full mt-6 py-3.5 rounded-full font-tajawal font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{
                        background:
                          "linear-gradient(135deg,#C9A227,#F5D76E)",
                        color: "#0F2419",
                      }}
                    >
                      {savingReview
                        ? t("جاري الإرسال...", "Submitting...")
                        : t("إرسال التقييم", "Submit Review")}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
