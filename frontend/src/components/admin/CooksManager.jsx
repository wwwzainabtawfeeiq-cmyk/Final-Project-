import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChefHat,
  Check,
  Ban,
  Search,
  Eye,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";

const STATUS_CONFIG = {
  active: {
    ar: "موثق",
    en: "Verified",
    color: "#22c55e",
  },
  pending: {
    ar: "بانتظار التوثيق",
    en: "Pending",
    color: "#F5D76E",
  },
};

export default function CooksManager() {
  const { t, lang } = useLanguage();

  const [cooks, setCooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadCooks = async () => {
    try {
      setLoading(true);

      const response = await API.get("/public-cooks");

      setCooks(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to load cooks:", error);
      setCooks([]);
      toast.error(
        t("تعذر تحميل الطباخين", "Failed to load cooks")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCooks();
  }, []);

  const filteredCooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cooks.filter((cook) => {
      const name = String(cook.name || "").toLowerCase();
      const email = String(cook.email || "").toLowerCase();
      const phone = String(cook.phone || "").toLowerCase();
      const address = String(cook.address || "").toLowerCase();

      const matchSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        address.includes(query);

      const isVerified = Boolean(cook.is_verified);

      const matchFilter =
        filter === "all" ||
        (filter === "active" && isVerified) ||
        (filter === "pending" && !isVerified);

      return matchSearch && matchFilter;
    });
  }, [cooks, search, filter]);

  const handleVerify = async (id) => {
    try {
      setProcessingId(id);

      await API.put(`/cook-verification/${id}/verify`);

      setCooks((prev) =>
        prev.map((cook) =>
          cook.id === id
            ? { ...cook, is_verified: true }
            : cook
        )
      );

      toast.success(
        t("تم توثيق الطباخ", "Cook verified successfully")
      );
    } catch (error) {
      console.error("Failed to verify cook:", error);

      toast.error(
        error?.response?.data?.message ||
          t("تعذر توثيق الطباخ", "Failed to verify cook")
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnverify = async (id) => {
    try {
      setProcessingId(id);

      await API.put(`/cook-verification/${id}/unverify`);

      setCooks((prev) =>
        prev.map((cook) =>
          cook.id === id
            ? { ...cook, is_verified: false }
            : cook
        )
      );

      toast.success(
        t("تم إلغاء توثيق الطباخ", "Cook verification removed")
      );
    } catch (error) {
      console.error("Failed to unverify cook:", error);

      toast.error(
        error?.response?.data?.message ||
          t("تعذر تحديث حالة الطباخ", "Failed to update cook")
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatus = (cook) =>
    cook.is_verified
      ? STATUS_CONFIG.active
      : STATUS_CONFIG.pending;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2">
          <ChefHat size={24} />
          {t("إدارة الطباخين", "Cooks Manager")}
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
              "ابحث بالاسم أو الهاتف أو العنوان...",
              "Search by name, phone or address..."
            )}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: "all", ar: "الكل", en: "All" },
          { key: "active", ar: "الموثقون", en: "Verified" },
          {
            key: "pending",
            ar: "بانتظار التوثيق",
            en: "Pending",
          },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className="px-4 py-2 rounded-full font-tajawal text-xs font-bold whitespace-nowrap transition-all"
            style={{
              background:
                filter === item.key
                  ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                  : "rgba(255, 255, 255, 0.08)",
              color:
                filter === item.key
                  ? "#0F2419"
                  : "rgba(255, 255, 255, 0.7)",
              border:
                filter === item.key
                  ? "none"
                  : "1px solid rgba(201, 162, 39, 0.25)",
            }}
          >
            {lang === "ar" ? item.ar : item.en}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <ChefHat
            size={48}
            className="mx-auto mb-4 animate-pulse"
            style={{ color: "rgba(201, 162, 39, 0.5)" }}
          />
          <p className="font-tajawal text-white/60">
            {t("جاري تحميل الطباخين...", "Loading cooks...")}
          </p>
        </div>
      ) : filteredCooks.length === 0 ? (
        <div className="text-center py-16">
          <ChefHat
            size={48}
            className="mx-auto mb-4"
            style={{ color: "rgba(201, 162, 39, 0.3)" }}
          />

          <p
            className="font-tajawal"
            style={{ color: "rgba(255, 255, 255, 0.6)" }}
          >
            {t("لا توجد نتائج", "No results")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCooks.map((cook, index) => {
            const status = getStatus(cook);
            const isProcessing = processingId === cook.id;

            return (
              <motion.div
                key={cook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl p-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.5))",
                  border: cook.is_verified
                    ? "1px solid rgba(201, 162, 39, 0.2)"
                    : "2px solid rgba(201, 162, 39, 0.6)",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(201, 162, 39, 0.12)",
                      border: "2px solid #C9A227",
                    }}
                  >
                    <ChefHat
                      size={28}
                      style={{ color: "#F5D76E" }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className="font-tajawal font-bold text-base"
                          style={{ color: "#FFFFFF" }}
                        >
                          {cook.name || t("بدون اسم", "Unnamed cook")}
                        </h3>

                        <p
                          className="font-tajawal text-xs mt-1"
                          style={{
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          ID: {cook.id}
                        </p>
                      </div>

                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-tajawal font-bold"
                        style={{
                          background: `${status.color}20`,
                          color: status.color,
                          border: `1px solid ${status.color}40`,
                        }}
                      >
                        {lang === "ar" ? status.ar : status.en}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {cook.phone && (
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <Phone
                        size={14}
                        style={{ color: "#F5D76E" }}
                      />
                      <span className="font-tajawal">
                        {cook.phone}
                      </span>
                    </div>
                  )}

                  {cook.address && (
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <MapPin
                        size={14}
                        style={{ color: "#F5D76E" }}
                      />
                      <span className="font-tajawal">
                        {cook.address}
                      </span>
                    </div>
                  )}

                  {cook.bio && (
                    <p
                      className="font-tajawal text-xs leading-6"
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      {cook.bio}
                    </p>
                  )}
                </div>

                <div
                  className="rounded-xl p-3 mb-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {cook.is_verified ? (
                      <ShieldCheck
                        size={18}
                        style={{ color: "#22c55e" }}
                      />
                    ) : (
                      <Clock
                        size={18}
                        style={{ color: "#F5D76E" }}
                      />
                    )}

                    <div>
                      <p
                        className="font-tajawal text-xs font-bold"
                        style={{ color: "#FFFFFF" }}
                      >
                        {cook.is_verified
                          ? t(
                              "الحساب موثق",
                              "Verified account"
                            )
                          : t(
                              "الحساب بانتظار التوثيق",
                              "Verification pending"
                            )}
                      </p>

                      <p
                        className="font-tajawal text-[10px] mt-1"
                        style={{
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        {t(
                          "البيانات من قاعدة البيانات",
                          "Data from database"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!cook.is_verified ? (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleVerify(cook.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-tajawal text-xs font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: "#FFFFFF",
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                    >
                      <Check size={14} />
                      {isProcessing
                        ? t("جاري...", "Processing...")
                        : t("توثيق", "Verify")}
                    </button>
                  ) : (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleUnverify(cook.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl font-tajawal text-xs font-bold"
                      style={{
                        border:
                          "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#f87171",
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                    >
                      <Ban size={14} />
                      {isProcessing
                        ? t("جاري...", "Processing...")
                        : t("إلغاء التوثيق", "Unverify")}
                    </button>
                  )}

                  <button
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl"
                    style={{
                      border:
                        "1px solid rgba(201, 162, 39, 0.4)",
                      color: "#F5D76E",
                    }}
                    title={t("عرض", "View")}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
