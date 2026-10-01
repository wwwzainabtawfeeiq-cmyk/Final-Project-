import { motion } from "framer-motion";
import {
  Users,
  ChefHat,
  ShoppingBag,
  DollarSign,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminStats({
  totalUsers,
  totalCooks,
  totalOrders,
  totalRevenue,
  activeOrders,
}) {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      label: t("المستخدمون", "Users"),
      value: totalUsers.toLocaleString(),
      color: "#3b82f6",
    },
    {
      icon: ChefHat,
      label: t("الطُهاة", "Cooks"),
      value: totalCooks.toLocaleString(),
      color: "#F5D76E",
    },
    {
      icon: ShoppingBag,
      label: t("الطلبات", "Orders"),
      value: totalOrders.toLocaleString(),
      color: "#a855f7",
    },
    {
      icon: DollarSign,
      label: t("الإيرادات", "Revenue"),
      value: `${(totalRevenue / 1000000).toFixed(1)}M`,
      color: "#22c55e",
    },
    {
      icon: Activity,
      label: t("نشطة الآن", "Active"),
      value: activeOrders,
      color: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 36, 25, 0.8), rgba(27, 67, 50, 0.6))",
              border: "1px solid rgba(201, 162, 39, 0.2)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
              style={{ background: stat.color, filter: "blur(40px)" }}
            />

            <div className="relative z-10">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}40, ${stat.color}20)`,
                  border: `1px solid ${stat.color}60`,
                }}
              >
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <p
                className="font-tajawal text-xs mb-1"
                style={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                {stat.label}
              </p>
              <p
                className="font-cairo text-2xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                {stat.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
