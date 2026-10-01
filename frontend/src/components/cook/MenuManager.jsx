import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Package, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import API from "@/services/api";
import MealCardCook from "./MealCardCook";
import AddMealModal from "./AddMealModal";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} IQD`;

const categoryMap = {
  main: "Main Dishes",
  grill: "Grills",
  rice: "Rice & Biryani",
  appetizer: "Appetizers",
  dessert: "Desserts",
  bread: "Bread",
  soup: "Soups",
};

const mapMeal = (meal) => ({
  ...meal,
  image: meal.image_url || "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
  nameEn: meal.name,
  descriptionEn: meal.description || "",
  rating: Number(meal.rating || 0),
  prepTime: "-",
  spicy: false,
  sweet: false,
  category: meal.category_name || "",
  tags: meal.tags || [],
  availableQuantity: Number(meal.available_quantity || 0),
  is_available: meal.is_available !== false,
});

export default function MenuManager() {
  const { t, lang } = useLanguage();

  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [mealsResponse, categoriesResponse] = await Promise.all([
        API.get("/meals/my-meals"),
        API.get("/categories"),
      ]);

      const rawMeals = mealsResponse.data?.meals || [];
      const rawCategories = categoriesResponse.data?.data || [];

      setMeals(rawMeals.map(mapMeal));
      setCategories(rawCategories);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          t("تعذر تحميل قائمة الأكلات", "Failed to load meals")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      if (tab === "active") return meal.is_available;
      if (tab === "hidden") return !meal.is_available;
      return true;
    });
  }, [meals, tab]);

  const TABS = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "active", ar: "النشطة", en: "Active" },
    { key: "hidden", ar: "المخفية", en: "Hidden" },
  ];

  const handleAdd = () => {
    setEditingMeal(null);
    setModalOpen(true);
  };

  const handleEdit = (meal) => {
    setEditingMeal({
      id: meal.id,
      name: meal.name || "",
      nameEn: meal.nameEn || meal.name || "",
      description: meal.description || "",
      descriptionEn: meal.descriptionEn || meal.description || "",
      price: meal.price || "",
      image: meal.image || "",
      category:
        Object.keys(categoryMap).find(
          (key) => categoryMap[key] === meal.category
        ) || "",
      prepTime: meal.prepTime || "",
      tags: meal.tags || [],
      spicy: meal.spicy || false,
      sweet: meal.sweet || false,
      availableQuantity: meal.availableQuantity ?? 0,
      is_available: meal.is_available,
    });

    setModalOpen(true);
  };

  const getCategoryId = (categoryKey) => {
    const categoryName = categoryMap[categoryKey] || categoryKey;

    const category = categories.find(
      (item) =>
        String(item.name).trim().toLowerCase() ===
        String(categoryName).trim().toLowerCase()
    );

    return category?.id || null;
  };

  const handleSave = async (data) => {
    try {
      const categoryId = getCategoryId(data.category);

      if (!categoryId && data.category) {
        toast.error(
          t("الفئة غير موجودة في قاعدة البيانات", "Category not found")
        );
        return;
      }

      const payload = {
        category_id: categoryId,
        name: data.name || data.nameEn,
        description: data.description || data.descriptionEn || "",
        price: Number(data.price),
        available_quantity: Number(
          data.availableQuantity ?? editingMeal?.availableQuantity ?? 0
        ),
        is_available: editingMeal?.is_available ?? true,
        image_url: data.image || null,
      };

      let response;

      if (data.id) {
        response = await API.put(`/meals/${data.id}`, payload);

        const updated = mapMeal({
          ...response.data.meal,
          category_name:
            categories.find((c) => c.id === categoryId)?.name || "",
        });

        setMeals((prev) =>
          prev.map((meal) => (meal.id === data.id ? updated : meal))
        );

        toast.success(
          t("تم تحديث الطبق", "Meal updated successfully")
        );
      } else {
        response = await API.post("/meals", payload);

        const created = mapMeal({
          ...response.data.meal,
          category_name:
            categories.find((c) => c.id === categoryId)?.name || "",
        });

        setMeals((prev) => [created, ...prev]);

        toast.success(
          t("تمت إضافة الطبق", "Meal added successfully")
        );
      }

      setModalOpen(false);
      setEditingMeal(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          t("تعذر حفظ الطبق", "Failed to save meal")
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/meals/${id}`);

      setMeals((prev) => prev.filter((meal) => meal.id !== id));
      setConfirmDelete(null);

      toast.success(
        t("تم حذف الطبق", "Meal deleted successfully")
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          t("تعذر حذف الطبق", "Failed to delete meal")
      );
    }
  };

  const handleToggleHide = async (id) => {
    const meal = meals.find((item) => item.id === id);

    if (!meal) return;

    try {
      await API.put(`/meals/${id}`, {
        category_id: meal.category_id || null,
        name: meal.name,
        description: meal.description || "",
        price: Number(meal.price),
        available_quantity: Number(meal.available_quantity ?? 0),
        is_available: !meal.is_available,
        image_url: meal.image_url || meal.image || null,
      });

      setMeals((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, is_available: !item.is_available }
            : item
        )
      );

      toast.success(
        meal.is_available
          ? t("تم إخفاء الطبق", "Meal hidden")
          : t("تم إظهار الطبق", "Meal shown")
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          t("تعذر تغيير حالة الطبق", "Failed to change meal status")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {t("إدارة القائمة", "Menu Management")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {meals.length} {t("طبق", "meals")}
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          <Plus size={18} />
          {t("إضافة طبق", "Add Meal")}
        </button>
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === item.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {lang === "ar" ? item.ar : item.en}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="text-muted-foreground">
            {t("جاري تحميل الأطباق...", "Loading meals...")}
          </div>
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed">
          <Package size={42} className="mb-3 text-muted-foreground" />
          <p className="font-semibold">
            {t("لا توجد أطباق", "No meals found")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("أضف طبقاً جديداً للبدء", "Add a meal to get started")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredMeals.map((meal) => (
              <MealCardCook
                key={meal.id}
                meal={meal}
                hidden={!meal.is_available}
                onEdit={handleEdit}
                onDelete={(id) => setConfirmDelete(id)}
                onToggleHide={handleToggleHide}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddMealModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSave}
        editingMeal={editingMeal}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <AlertCircle className="text-destructive" />
              <h3 className="text-lg font-bold">
                {t("حذف الطبق؟", "Delete meal?")}
              </h3>
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
              {t(
                "هل أنت متأكد من حذف هذا الطبق؟ لا يمكن التراجع عن العملية.",
                "Are you sure you want to delete this meal? This cannot be undone."
              )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border px-4 py-2"
              >
                {t("إلغاء", "Cancel")}
              </button>

              <button
                onClick={() => handleDelete(confirmDelete)}
                className="rounded-xl bg-destructive px-4 py-2 text-destructive-foreground"
              >
                {t("حذف", "Delete")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
