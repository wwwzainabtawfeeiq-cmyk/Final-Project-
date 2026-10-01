import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  ChefHat,
  Shield,
  MapPin,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [portal, setPortal] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // حقول خاصة بالطباخ
  const [specialty, setSpecialty] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من الحقول
    if (!name || !email || !password || !confirmPassword) {
      toast.error(t("يرجى ملء جميع الحقول", "Please fill all fields"));
      return;
    }

    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|iq|edu)$/i;
    if (!emailRegex.test(email)) {
      toast.error(
        t(
          "يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com)",
          "Please enter a valid email (e.g., name@example.com)",
        ),
      );
      return;
    }

    // التحقق من الهاتف (اختياري)
    if (phone && phone.replace(/\D/g, "").length < 10) {
      toast.error(
        t("يرجى إدخال رقم هاتف صحيح", "Please enter a valid phone number"),
      );
      return;
    }
    // إضافة حقول إضافية للطباخ
    const fullName =
      portal === "cook" && specialty ? `${name} (${specialty})` : name;

    register(fullName, email, portal);
    toast.success(
      t(
        `مرحباً بك! تم إنشاء حسابك كـ ${portal === "cook" ? "طباخ" : portal === "admin" ? "مدير" : "عميل"}`,
        `Welcome! Account created as ${portal}`,
      ),
    );

    // توجيه حسب البوابة
    if (portal === "cook") navigate("/cook-dashboard");
    else if (portal === "admin") navigate("/admin");
    else navigate("/");
  };

  const PORTALS = [
    {
      id: "customer",
      label: t("عميل", "Customer"),
      icon: User,
      desc: t("اطلب أطباقك", "Order dishes"),
      gradient: "linear-gradient(135deg, #1B4332, #2D5A3D)",
    },
    {
      id: "cook",
      label: t("طباخ", "Cook"),
      icon: ChefHat,
      desc: t("اعرض أطباقك", "Showcase your dishes"),
      gradient: "linear-gradient(135deg, #C9A227, #F5D76E)",
    },
    {
      id: "admin",
      label: t("مدير", "Admin"),
      icon: Shield,
      desc: t("تحكم كامل", "Full control"),
      gradient: "linear-gradient(135deg, #8B6914, #5C3A21)",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* الخلفية */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(27,67,50,0.4), #0F2419)",
        }}
      />

      {/* جزيئات ذهبية */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 4,
            height: 4,
            backgroundColor: "rgba(201, 162, 39, 0.3)",
            filter: "blur(3px)",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(15, 36, 25, 0.9)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(201, 162, 39, 0.4)",
          boxShadow: "0 25px 80px rgba(201, 162, 39, 0.2)",
        }}
      >
        {/* العنوان */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #1B4332, #0F2419)",
              border: "2px solid #C9A227",
              boxShadow: "0 0 30px rgba(201, 162, 39, 0.5)",
            }}
          >
            <span className="font-ruqaa text-5xl text-gradient-gold">ن</span>
          </div>
          <h1 className="font-ruqaa text-3xl text-gradient-gold">
            {t("حساب جديد", "Register")}
          </h1>
          <p
            className="font-tajawal text-sm mt-2"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {t("انضم إلى عائلة نكهة البصرة", "Join the Basra Flavor family")}
          </p>
        </div>

        {/* اختيار البوابة */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PORTALS.map((p) => {
            const Icon = p.icon;
            const isActive = portal === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPortal(p.id)}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  background: isActive
                    ? p.gradient
                    : "rgba(255, 255, 255, 0.05)",
                  border: isActive
                    ? "2px solid rgba(201, 162, 39, 0.6)"
                    : "1px solid rgba(201, 162, 39, 0.2)",
                  boxShadow: isActive
                    ? "0 10px 30px rgba(201, 162, 39, 0.3)"
                    : "none",
                }}
              >
                <Icon
                  size={22}
                  className="mx-auto mb-1"
                  style={{ color: isActive ? "#FFFFFF" : "#F5D76E" }}
                />

                <div
                  className="font-tajawal text-sm font-bold"
                  style={{
                    color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {p.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم */}
          <div>
            <label
              className="block font-tajawal text-sm mb-2"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {t("الاسم الكامل", "Full Name")}
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                style={{ color: "#C9A227" }}
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("اسمك الكامل", "Your full name")}
                className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
              />
            </div>
          </div>

          {/* البريد */}
          <div>
            <label
              className="block font-tajawal text-sm mb-2"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {t("البريد الإلكتروني", "Email")}
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                style={{ color: "#C9A227" }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("أدخل بريدك الإلكتروني", "Enter your email")}
                className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
              />
            </div>
          </div>

          {/* الهاتف */}
          <div>
            <label
              className="block font-tajawal text-sm mb-2"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {t("رقم الهاتف", "Phone")}
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                style={{ color: "#C9A227" }}
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0770 123 4567"
                className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
              />
            </div>
          </div>

          {/* حقول خاصة بالطباخ */}
          {portal === "cook" && (
            <>
              <div>
                <label
                  className="block font-tajawal text-sm mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  {t("التخصص", "Specialty")}
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                    style={{ color: "#C9A227" }}
                  />

                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder={t(
                      "مسكوف، مشاوي، حلويات...",
                      "Masgouf, Grills, Sweets...",
                    )}
                    className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block font-tajawal text-sm mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  {t("المنطقة", "Area")}
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                    style={{ color: "#C9A227" }}
                  />

                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={t(
                      "العشار، الجبيلة، الزبير...",
                      "Ashar, Jubaila, Zubair...",
                    )}
                    className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
                  />
                </div>
              </div>
            </>
          )}

          {/* كلمة المرور */}
          <div>
            <label
              className="block font-tajawal text-sm mb-2"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {t("كلمة المرور", "Password")}
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                style={{ color: "#C9A227" }}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("8 أحرف على الأقل", "At least 8 characters")}
                className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
              />
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label
              className="block font-tajawal text-sm mb-2"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {t("تأكيد كلمة المرور", "Confirm Password")}
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none"
                style={{ color: "#C9A227" }}
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("أعد كتابة كلمة المرور", "Re-enter password")}
                className="w-full rounded-xl py-3 pr-11 pl-4 font-tajawal"
              />
            </div>
          </div>

          {/* زر الإنشاء */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-tajawal font-bold text-lg relative overflow-hidden transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #C9A227, #F5D76E)" }}
          >
            <span className="relative z-10" style={{ color: "#0F2419" }}>
              {t("إنشاء حساب", "Create Account")}
            </span>
            <span className="absolute inset-0 shine-bg" />
          </button>
        </form>

        {/* رابط تسجيل الدخول */}
        <p
          className="text-center font-tajawal text-sm mt-6"
          style={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          {t("لديك حساب بالفعل؟", "Already have an account?")}{" "}
          <Link
            to="/login"
            className="font-bold transition-all"
            style={{ color: "#F5D76E" }}
          >
            {t("سجل دخول", "Login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
