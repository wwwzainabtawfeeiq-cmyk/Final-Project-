import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { API_URL } from "@/services/api";

export default function CookCard({ cook, index = 0 }) {
  const { t, lang } = useLanguage();

  const isArabic = lang === "ar";

  const name = isArabic
    ? cook.name_ar || cook.name
    : cook.name_en || cook.name;

  const bio = isArabic
    ? cook.bio_ar || cook.bio
    : cook.bio_en || cook.bio;

  const image = cook.image_url
    ? `${API_URL.replace(/\/api$/, "")}${cook.image_url}`
    : cook.image || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
    >
      <Link
        to={`/cook/${cook.id}`}
        className="group relative block rounded-2xl overflow-hidden glass-light p-6 text-center transition-all duration-500 hover:gold-glow"
      >
        {cook.is_verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-tajawal font-bold bg-gold/10 text-gold">
            <BadgeCheck size={14} />
            <span>{t("طباخ موثّق", "Verified Cook")}</span>
          </div>
        )}

        <div className="relative w-28 h-28 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full gold-glow-strong transition-all duration-500 group-hover:gold-glow" />

          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "3px solid transparent",
              background:
                "linear-gradient(#0F2419, #0F2419) padding-box, linear-gradient(135deg, #C9A227, #F5D76E, #C9A227) border-box",
            }}
          >
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-emerald-deep text-cream/50 font-tajawal text-xs">
                {t("لا توجد صورة", "No image")}
              </div>
            )}
          </div>
        </div>

        <h3 className="font-ruqaa text-2xl text-cream mb-2">
          {name}
        </h3>

        {bio && (
          <p className="text-cream/60 text-sm font-tajawal leading-6 min-h-[48px]">
            {bio}
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-gold">
          <Award size={16} />
          <span className="font-tajawal text-sm">
            {cook.is_verified
              ? t("طباخ موثّق", "Verified Cook")
              : t("طباخ منزلي", "Home Cook")}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

