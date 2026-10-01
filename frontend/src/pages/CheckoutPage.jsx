import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  MapPin,
  CreditCard,
  Truck,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/utils/cn";
import { createOrder } from "@/services/orderService";
import CustomerNotes from "@/components/CheckOut/CustomerNotes";
import Method from "@/components/CheckOut/PaymentMethod";
import EventDetailsForm from "@/components/CheckOut/EventDetailsForm";

// ًں”¥ ظ†ظ…ط· ظ…ظˆط­ظ‘ط¯ ظ„ظ„ط­ظ‚ظˆظ„ (ظ…ط¶ظ…ظˆظ†)
const INPUT_STYLE = {
  color: "#FFFFFF",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(201, 162, 39, 0.35)",
  borderRadius: "12px",
  padding: "12px 16px",
  width: "100%",
  fontFamily: "Tajawal, sans-serif",
  fontSize: "16px",
  outline: "none",
  transition: "all 0.2s ease",
};

export default function CheckoutPage() {
  const { t, lang } = useLanguage();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [notesValue, setNotesValue] = useState({
    notes: "",
    hasAllergy: false,
    allergyDetails: "",
  });

  const [payment, setPayment] = useState({ method: "cod" });
  const [paymentError, setPaymentError] = useState(null);

  const [eventValue, setEventValue] = useState({
    isEvent: false,
  });

  const steps = [
    { icon: MapPin, title: t("ط§ظ„ط¹ظ†ظˆط§ظ†", "Address") },
    { icon: Truck, title: t("ط§ظ„طھظˆطµظٹظ„", "Delivery") },
    { icon: CreditCard, title: t("ط§ظ„ط¯ظپط¹", "Payment") },
    { icon: Check, title: t("طھط£ظƒظٹط¯", "Confirm") },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-gold/40 mx-auto mb-4" />
          <p className="text-cream/70 font-tajawal text-xl mb-6">
            {t("ط³ظ„طھظƒ ظپط§ط±ط؛ط©", "Your cart is empty")}
          </p>
          <button
            onClick={() => navigate("/meals")}
            className="px-6 py-3 rounded-full font-tajawal font-bold"
            style={{ background: "linear-gradient(135deg, #C9A227, #F5D76E)" }}
          >
            <span className="text-emerald-deep">
              {t("طھطµظپط­ ط§ظ„ط£ط·ط¨ط§ظ‚", "Browse Meals")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    if (step === 0) {
      if (!form.name || !form.phone || !form.address || !form.city) {
        toast.error(t("ظٹط±ط¬ظ‰ ظ…ظ„ط، ط¬ظ…ظٹط¹ ط§ظ„ط­ظ‚ظˆظ„", "Please fill all fields"));
        return;
      }
    }

    if (step === 2) {
      if (paymentError) {
        toast.error(paymentError);
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    } else { try { const result = await createOrder({ address_id: null, scheduled_at: null, notes: [`Customer: ${form.name}`, `Phone: ${form.phone}`, `Address: ${form.address}`, `City: ${form.city}`, notesValue?.notes || ""].filter(Boolean).join(" | ") }); if (!result?.success) throw new Error(result?.message || "Order creation failed"); toast.success(t("تم تأكيد طلبك بنجاح! 🎉", "Order confirmed successfully! 🎉")); clearCart(); navigate("/orders"); } catch (error) { console.error("Failed to create order:", error); toast.error(error?.response?.data?.message || t("تعذر تأكيد الطلب", "Failed to place order")); } }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-4xl mx-auto">
      <h1 className="font-ruqaa text-4xl text-center text-gradient-gold mb-10">
        {t("ط¥طھظ…ط§ظ… ط§ظ„ط·ظ„ط¨", "Checkout")}
      </h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  i <= step ? "gold-glow" : "glass-light",
                )}
                style={
                  i <= step
                    ? {
                        background: "linear-gradient(135deg, #C9A227, #F5D76E)",
                      }
                    : {}
                }
              >
                <s.icon
                  size={20}
                  className={i <= step ? "text-emerald-deep" : "text-gold/50"}
                />
              </div>
              <span
                className={cn(
                  "font-tajawal text-xs mt-2",
                  i <= step ? "text-gold-bright" : "text-cream/50",
                )}
              >
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all duration-500",
                  i < step ? "bg-gold" : "bg-gold/20",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: lang === "ar" ? -30 : 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass-light rounded-2xl p-6 md:p-8"
        >
          {/* ط§ظ„ط®ط·ظˆط© 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-4">
                {t("ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„طھظˆطµظٹظ„", "Delivery Information")}
              </h2>

              <input
                type="text"
                placeholder={t("ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„", "Full Name")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={INPUT_STYLE}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F5D76E";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(201, 162, 39, 0.2)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(201, 162, 39, 0.35)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
              />

              <input
                type="tel"
                placeholder={t("ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ", "Phone Number")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={INPUT_STYLE}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F5D76E";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(201, 162, 39, 0.2)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(201, 162, 39, 0.35)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
              />

              <input
                type="text"
                placeholder={t("ط§ظ„ط¹ظ†ظˆط§ظ†", "Address")}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                style={INPUT_STYLE}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F5D76E";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(201, 162, 39, 0.2)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(201, 162, 39, 0.35)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
              />

              <input
                type="text"
                placeholder={t("ط§ظ„ظ…ط¯ظٹظ†ط©", "City")}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={INPUT_STYLE}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#F5D76E";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(201, 162, 39, 0.2)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(201, 162, 39, 0.35)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
              />

              <EventDetailsForm value={eventValue} onChange={setEventValue} />

              <CustomerNotes value={notesValue} onChange={setNotesValue} />
            </div>
          )}

          {/* ط§ظ„ط®ط·ظˆط© 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-4">
                {t("ط·ط±ظٹظ‚ط© ط§ظ„طھظˆطµظٹظ„", "Delivery Method")}
              </h2>
              {[
                {
                  title: t("طھظˆطµظٹظ„ ط³ط±ظٹط¹", "Fast Delivery"),
                  desc: t("ط®ظ„ط§ظ„ 30-45 ط¯ظ‚ظٹظ‚ط©", "Within 30-45 minutes"),
                  price: 3000,
                },
                {
                  title: t("طھظˆطµظٹظ„ ظ…ط¬ط¯ظˆظ„", "Scheduled Delivery"),
                  desc: t("ط§ط®طھط± ط§ظ„ظˆظ‚طھ ط§ظ„ظ…ظ†ط§ط³ط¨", "Choose your preferred time"),
                  price: 2000,
                },
              ].map((opt, i) => (
                <label
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl glass cursor-pointer hover:gold-glow transition-all"
                >
                  <input
                    type="radio"
                    name="delivery"
                    defaultChecked={i === 0}
                    className="accent-gold w-4 h-4"
                  />

                  <div className="flex-1">
                    <h3
                      className="font-tajawal font-bold text-base"
                      style={{ color: "#FFFFFF" }}
                    >
                      {opt.title}
                    </h3>
                    <p
                      className="text-sm font-tajawal"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {opt.desc}
                    </p>
                  </div>
                  <span className="font-cairo text-gold-bright">
                    {formatPrice(opt.price)}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* ط§ظ„ط®ط·ظˆط© 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-4">
                {t("ط·ط±ظٹظ‚ط© ط§ظ„ط¯ظپط¹", "Payment Method")}
              </h2>
              <Method
                value={payment}
                onChange={(v, err) => {
                  setPayment(v);
                  setPaymentError(err);
                }}
              />
            </div>
          )}

          {/* ط§ظ„ط®ط·ظˆط© 4 */}
          {step === 3 && (
            <div>
              <h2 className="font-ruqaa text-2xl text-gold-bright mb-6">
                {t("طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨", "Confirm Order")}
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl glass"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3
                        className="font-tajawal text-sm"
                        style={{ color: "#FFFFFF" }}
                      >
                        {lang === "ar" ? item.name : item.nameEn}
                      </h3>
                      <p
                        className="text-xs font-cairo"
                        style={{ color: "rgba(255, 255, 255, 0.6)" }}
                      >
                        {formatPrice(item.price)} أ— {item.quantity}
                      </p>
                    </div>
                    <span className="font-cairo text-gold-bright">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {eventValue.isEvent && (
                <div className="mb-4 p-4 rounded-xl glass">
                  <p
                    className="font-tajawal text-xs mb-1"
                    style={{ color: "rgba(255, 255, 255, 0.6)" }}
                  >
                    ًںژ‰ {t("ظ…ظ†ط§ط³ط¨ط© ط®ط§طµط©", "Special Event")}:
                  </p>
                  <p
                    className="font-tajawal text-sm"
                    style={{ color: "rgba(255, 255, 255, 0.95)" }}
                  >
                    {eventValue.type &&
                      t(
                        {
                          birthday: "ط¹ظٹط¯ ظ…ظٹظ„ط§ط¯",
                          graduation: "طھط®ط±ط¬",
                          wedding: "ط²ظپط§ظپ",
                          condolence: "ط¹ط²ط§ط،",
                          other: "ط£ط®ط±ظ‰",
                        }[eventValue.type],
                        eventValue.type,
                      )}
                    {eventValue.guests &&
                      ` آ· ${eventValue.guests} ${t("ط´ط®طµ", "guests")}`}
                    {eventValue.urgent && " آ· âڑ، " + t("ظ…ط³طھط¹ط¬ظ„", "Urgent")}
                  </p>
                </div>
              )}

              {notesValue.notes && (
                <div className="mb-4 p-4 rounded-xl glass">
                  <p
                    className="font-tajawal text-xs mb-1"
                    style={{ color: "rgba(255, 255, 255, 0.6)" }}
                  >
                    {t("ظ…ظ„ط§ط­ط¸ط§طھظƒ", "Your Notes")}:
                  </p>
                  <p
                    className="font-tajawal text-sm"
                    style={{ color: "rgba(255, 255, 255, 0.95)" }}
                  >
                    {notesValue.notes}
                  </p>
                </div>
              )}

              {notesValue.hasAllergy && notesValue.allergyDetails && (
                <div className="mb-4 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                  <p className="font-tajawal text-xs text-red-400 mb-1">
                    âڑ ï¸ڈ {t("طھط­ط°ظٹط± ط­ط³ط§ط³ظٹط©", "Allergy Warning")}:
                  </p>
                  <p
                    className="font-tajawal text-sm"
                    style={{ color: "rgba(255, 255, 255, 0.95)" }}
                  >
                    {notesValue.allergyDetails}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl gold-border">
                <span
                  className="font-tajawal text-lg"
                  style={{ color: "#FFFFFF" }}
                >
                  {t("ط§ظ„ظ…ط¬ظ…ظˆط¹ ط§ظ„ظƒظ„ظٹ", "Grand Total")}
                </span>
                <span className="font-cairo text-2xl text-gradient-gold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 rounded-full glass-light font-tajawal text-gold-bright hover:gold-glow transition-all"
          >
            {t("ط§ظ„ط³ط§ط¨ظ‚", "Previous")}
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="px-8 py-3.5 rounded-full font-tajawal font-bold relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #C9A227, #F5D76E)" }}
        >
          <span className="relative z-10 text-emerald-deep flex items-center gap-2">
            {step === 3
              ? t("طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨", "Confirm Order")
              : t("ط§ظ„طھط§ظ„ظٹ", "Next")}
            {step < 3 && <Arrow size={18} />}
          </span>
          <span className="absolute inset-0 shine-bg" />
        </button>
      </div>
    </div>
  );
}



