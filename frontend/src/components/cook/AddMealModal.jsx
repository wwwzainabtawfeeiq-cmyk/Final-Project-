import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Flame, Cake, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES = [
  { key: "main", ar: "أطباق رئيسية", en: "Main Dishes" },
  { key: "grill", ar: "مشاوي", en: "Grills" },
  { key: "rice", ar: "أرز وبرياني", en: "Rice & Biryani" },
  { key: "appetizer", ar: "مقبلات", en: "Appetizers" },
  { key: "dessert", ar: "حلويات", en: "Desserts" },
  { key: "bread", ar: "خبز", en: "Bread" },
  { key: "soup", ar: "شوربات", en: "Soups" },
];

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

export default function AddMealModal({ isOpen, onClose, onSave, initialData }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(
    initialData || {
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      price: 0,
      image: "",
      category: "main",
      prepTime: "30 دقيقة",
      tags: [],
      spicy: false,
      sweet: false,
    },
  );
  const [tagInput, setTagInput] = useState("");

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (form.tags.includes(tagInput.trim())) return;
    set("tags", [...form.tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tag) =>
    set(
      "tags",
      form.tags.filter((t) => t !== tag),
    );

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error(t("اسم الطبق مطلوب", "Meal name is required"));
      return;
    }
    if (!form.nameEn.trim()) {
      toast.error(t("الاسم الإنجليزي مطلوب", "English name is required"));
      return;
    }
    if (form.price <= 0) {
      toast.error(
        t("السعر يجب أن يكون أكبر من 0", "Price must be greater than 0"),
      );
      return;
    }
    if (!form.image.trim()) {
      toast.error(t("رابط الصورة مطلوب", "Image URL is required"));
      return;
    }
    onSave(form);
    toast.success(
      initialData
        ? t("تم تحديث الطبق", "Meal updated")
        : t("تم إضافة الطبق بنجاح", "Meal added successfully"),
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 250 }}
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden my-8"
            style={{
              background: "linear-gradient(135deg, #0F2419 0%, #1B4332 100%)",
              border: "2px solid rgba(201, 162, 39, 0.4)",
              boxShadow: "0 25px 80px rgba(201, 162, 39, 0.3)",
            }}
          >
            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <X size={18} style={{ color: "#F5D76E" }} />
            </button>

            <div className="p-8">
              {/* العنوان */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
                  style={{
                    background: "linear-gradient(135deg, #C9A227, #F5D76E)",
                  }}
                >
                  <Upload size={26} style={{ color: "#0F2419" }} />
                </div>
                <h2 className="font-ruqaa text-3xl text-gradient-gold mb-1">
                  {initialData
                    ? t("تعديل الطبق", "Edit Meal")
                    : t("إضافة طبق جديد", "Add New Meal")}
                </h2>
                <p
                  className="font-tajawal text-sm"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  {t("أدخل تفاصيل الطبق", "Enter meal details")}
                </p>
              </div>

              {/* النموذج */}
              <div className="space-y-4">
                {/* الاسم عربي + إنجليزي */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block font-tajawal text-sm mb-2"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {t("الاسم (عربي)", "Name (Arabic)")} *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder={t("مسكوف بصري", "Basra Masgouf")}
                      style={INPUT_STYLE}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-tajawal text-sm mb-2"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {t("الاسم (إنجليزي)", "Name (English)")} *
                    </label>
                    <input
                      type="text"
                      value={form.nameEn}
                      onChange={(e) => set("nameEn", e.target.value)}
                      placeholder="Basra Masgouf"
                      style={INPUT_STYLE}
                    />
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label
                    className="block font-tajawal text-sm mb-2"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {t("الوصف", "Description")}
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder={t("وصف قصير للطبق", "Short description")}
                    style={{ ...INPUT_STYLE, resize: "vertical" }}
                  />
                </div>

                {/* السعر + الفئة + وقت التحضير */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="block font-tajawal text-sm mb-2"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {t("السعر (د.ع)", "Price (IQD)")} *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={(e) => set("price", Number(e.target.value))}
                      placeholder="18000"
                      style={INPUT_STYLE}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-tajawal text-sm mb-2"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {t("الفئة", "Category")}
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      style={INPUT_STYLE}
                    >
                      {CATEGORIES.map((c) => (
                        <option
                          key={c.key}
                          value={c.key}
                          style={{ background: "#0F2419", color: "#FFFFFF" }}
                        >
                          {t(c.ar, c.en)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block font-tajawal text-sm mb-2"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {t("وقت التحضير", "Prep Time")}
                    </label>
                    <input
                      type="text"
                      value={form.prepTime}
                      onChange={(e) => set("prepTime", e.target.value)}
                      placeholder="30 دقيقة"
                      style={INPUT_STYLE}
                    />
                  </div>
                </div>

                {/* الصورة */}
                <div>
                  <label
                    className="block font-tajawal text-sm mb-2"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {t("رابط الصورة", "Image URL")} *
                  </label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="https://..."
                    style={{ ...INPUT_STYLE, direction: "ltr" }}
                  />

                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="mt-3 w-full h-32 object-cover rounded-xl"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>

                {/* الوسوم */}
                <div>
                  <label
                    className="block font-tajawal text-sm mb-2"
                    style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {t("الوسوم", "Tags")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      placeholder={t(
                        "مثال: سمك، مشوي...",
                        "e.g., fish, grilled...",
                      )}
                      style={INPUT_STYLE}
                    />

                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 rounded-xl font-tajawal font-bold"
                      style={{
                        background: "linear-gradient(135deg, #C9A227, #F5D76E)",
                        color: "#0F2419",
                      }}
                    >
                      +
                    </button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-tajawal flex items-center gap-2"
                          style={{
                            background: "rgba(201, 162, 39, 0.15)",
                            color: "#F5D76E",
                            border: "1px solid rgba(201, 162, 39, 0.4)",
                          }}
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* خيارات */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form.spicy}
                      onChange={(e) => set("spicy", e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />

                    <Flame size={16} style={{ color: "#ef4444" }} />
                    <span
                      className="font-tajawal text-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {t("حار", "Spicy")}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form.sweet}
                      onChange={(e) => set("sweet", e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />

                    <Cake size={16} style={{ color: "#F5D76E" }} />
                    <span
                      className="font-tajawal text-sm"
                      style={{ color: "#FFFFFF" }}
                    >
                      {t("حلو", "Sweet")}
                    </span>
                  </label>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-full font-tajawal font-bold transition-all"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {t("إلغاء", "Cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 rounded-full font-tajawal font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #C9A227, #F5D76E)",
                    color: "#0F2419",
                  }}
                >
                  <Save size={18} />
                  {initialData ? t("تحديث", "Update") : t("حفظ", "Save")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
