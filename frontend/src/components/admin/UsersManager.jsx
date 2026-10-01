import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { User, ChefHat, Shield, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";

const ROLE_CONFIG = {
  customer: {
    ar: "عميل",
    en: "Customer",
    icon: User,
    color: "#3b82f6",
  },
  cook: {
    ar: "طباخ",
    en: "Cook",
    icon: ChefHat,
    color: "#F5D76E",
  },
  admin: {
    ar: "مدير",
    en: "Admin",
    icon: Shield,
    color: "#a855f7",
  },
};

export default function UsersManager() {
  const { t, lang } = useLanguage();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await API.get("/admin/users");

      setUsers(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);

      toast.error(
        t("تعذر تحميل المستخدمين", "Failed to load users")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = String(user.name || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();

      const matchSearch =
        !query ||
        name.includes(query) ||
        email.includes(query);

      const matchFilter =
        filter === "all" || user.role === filter;

      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t(
        "هل أنت متأكد من حذف هذا المستخدم؟",
        "Are you sure you want to delete this user?"
      )
    );

    if (!confirmed) return;

    try {
      await API.delete(`/admin/users/${id}`);

      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );

      toast.success(
        t("تم حذف المستخدم", "User deleted successfully")
      );
    } catch (error) {
      console.error("Failed to delete user:", error);

      toast.error(
        error?.response?.data?.message ||
          t("تعذر حذف المستخدم", "Failed to delete user")
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2">
          <User size={24} />
          {t("إدارة المستخدمين", "Users Manager")}
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
              "ابحث بالاسم أو البريد...",
              "Search by name or email..."
            )}
            className="w-full rounded-xl py-2.5 pr-11 pl-4 font-tajawal text-sm"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: "all", ar: "الكل", en: "All" },
            { key: "customer", ar: "العملاء", en: "Customers" },
            { key: "cook", ar: "الطباخون", en: "Cooks" },
            { key: "admin", ar: "المديرون", en: "Admins" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className="px-3 py-2 rounded-full font-tajawal text-xs font-bold transition-all"
              style={{
                background:
                  filter === item.key
                    ? "linear-gradient(135deg, #C9A227, #F5D76E)"
                    : "rgba(255, 255, 255, 0.08)",
                color:
                  filter === item.key
                    ? "#0F2419"
                    : "rgba(255, 255, 255, 0.7)",
              }}
            >
              {lang === "ar" ? item.ar : item.en}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <User
            size={42}
            className="mx-auto mb-4 animate-pulse"
            style={{ color: "rgba(201, 162, 39, 0.5)" }}
          />

          <p className="font-tajawal text-white/60">
            {t(
              "جاري تحميل المستخدمين...",
              "Loading users..."
            )}
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(201, 162, 39, 0.2)",
          }}
        >
          <div
            className="grid grid-cols-12 gap-4 px-5 py-3"
            style={{
              background: "rgba(15, 36, 25, 0.8)",
            }}
          >
            <div
              className="col-span-4 font-tajawal text-xs font-bold"
              style={{ color: "#F5D76E" }}
            >
              {t("الاسم", "Name")}
            </div>

            <div
              className="col-span-4 font-tajawal text-xs font-bold"
              style={{ color: "#F5D76E" }}
            >
              {t("البريد", "Email")}
            </div>

            <div
              className="col-span-2 font-tajawal text-xs font-bold"
              style={{ color: "#F5D76E" }}
            >
              {t("النوع", "Role")}
            </div>

            <div
              className="col-span-2 font-tajawal text-xs font-bold text-left"
              style={{ color: "#F5D76E" }}
            >
              {t("إجراء", "Action")}
            </div>
          </div>

          {filteredUsers.map((user, index) => {
            const roleConfig =
              ROLE_CONFIG[user.role] || ROLE_CONFIG.customer;

            const RoleIcon = roleConfig.icon;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-t"
                style={{
                  borderColor:
                    "rgba(201, 162, 39, 0.1)",
                }}
              >
                <div
                  className="col-span-4 font-tajawal text-sm"
                  style={{ color: "#FFFFFF" }}
                >
                  {user.name}
                </div>

                <div
                  className="col-span-4 font-cairo text-xs"
                  style={{
                    color:
                      "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {user.email}
                </div>

                <div className="col-span-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-tajawal"
                    style={{
                      background: `${roleConfig.color}20`,
                      color: roleConfig.color,
                      border: `1px solid ${roleConfig.color}40`,
                    }}
                  >
                    <RoleIcon size={12} />
                    {lang === "ar"
                      ? roleConfig.ar
                      : roleConfig.en}
                  </span>
                </div>

                <div className="col-span-2 text-left">
                  <button
                    onClick={() =>
                      handleDelete(user.id)
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-tajawal font-bold"
                    style={{
                      border:
                        "1px solid rgba(239, 68, 68, 0.4)",
                      color: "#f87171",
                    }}
                  >
                    <Trash2 size={12} />
                    {t("حذف", "Delete")}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <p
                className="font-tajawal"
                style={{
                  color:
                    "rgba(255, 255, 255, 0.5)",
                }}
              >
                {t("لا توجد نتائج", "No results")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
