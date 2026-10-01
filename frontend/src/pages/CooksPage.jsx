import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { getCooks } from "@/services/cookService";
import CookCard from "@/components/cooks/CookCard";
import NearbyCooksFilter from "@/components/search/NearbyCooksFilter";

export default function CooksPage() {
  const { t, lang } = useLanguage();
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    const loadCooks = async () => {
      try {
        const response = await getCooks();
        setCooks(response?.data || response || []);
      } catch (error) {
        console.error("Failed to load cooks:", error);
        setCooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadCooks();
  }, []);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-ruqaa text-5xl text-center text-gradient-gold mb-4"
      >
        {t("طهاة نكهة البصرة", "Basra Flavor Cooks")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-cream/60 font-tajawal text-center mb-8 max-w-2xl mx-auto"
      >
        {t(
          "طهاة منزليون موثوقون بوصفات وخبرات مميزة",
          "Trusted home cooks with years of experience and inherited recipes"
        )}
      </motion.p>

      <div className="flex justify-center mb-10">
        <NearbyCooksFilter onLocate={setUserCoords} />
      </div>

      {userCoords && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gold-bright font-tajawal text-sm mb-6"
        >
          ✨ {t("تم تفعيل تحديد الموقع", "Location enabled")}
        </motion.p>
      )}

      {loading ? (
        <div className="text-center text-cream/70 py-16">
          {lang === "ar" ? "جاري تحميل الطهاة..." : "Loading cooks..."}
        </div>
      ) : cooks.length === 0 ? (
        <div className="text-center text-cream/70 py-16">
          {lang === "ar" ? "لا يوجد طهاة متاحون حاليًا" : "No cooks available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cooks.map((cook, i) => (
            <CookCard key={cook.id} cook={cook} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
