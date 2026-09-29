import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { meals as initialMeals } from '@/data/mockData';
import MealCardCook from './MealCardCook';
import AddMealModal, { type MealFormData } from './AddMealModal';

type TabKey = 'all' | 'active' | 'hidden';

export default function MenuManager() {
  const { t, lang } = useLanguage();
  const [meals, setMeals] = useState(initialMeals);
  const [hiddenMeals, setHiddenMeals] = useState<number[]>([]);
  const [tab, setTab] = useState<TabKey>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealFormData | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // تصفية الأطباق حسب التبويب
  const filteredMeals = meals.filter((meal) => {
    if (tab === 'active') return !hiddenMeals.includes(meal.id);
    if (tab === 'hidden') return hiddenMeals.includes(meal.id);
    return true;
  });

  const TABS: { key: TabKey; ar: string; en: string }[] = [
    { key: 'all', ar: 'الكل', en: 'All' },
    { key: 'active', ar: 'النشطة', en: 'Active' },
    { key: 'hidden', ar: 'المخفية', en: 'Hidden' },
  ];

  const handleAdd = () => {
    setEditingMeal(null);
    setModalOpen(true);
  };

  const handleEdit = (meal: (typeof meals)[0]) => {
    setEditingMeal({
      id: meal.id,
      name: meal.name,
      nameEn: meal.nameEn,
      description: meal.description,
      descriptionEn: meal.descriptionEn,
      price: meal.price,
      image: meal.image,
      category: meal.category,
      prepTime: meal.prepTime,
      tags: meal.tags || [],
      spicy: meal.spicy,
      sweet: meal.sweet,
    });
    setModalOpen(true);
  };

  const handleSave = (data: MealFormData) => {
    if (data.id) {
      // تعديل
      setMeals((prev) =>
        prev.map((m) =>
          m.id === data.id ? ({ ...m, ...data } as typeof m) : m
        )
      );
    } else {
      // إضافة
      const newMeal = {
        ...data,
        id: Math.max(...meals.map((m) => m.id)) + 1,
        cookId: 1,
        rating: 5.0,
      } as typeof meals[0];
      setMeals((prev) => [newMeal, ...prev]);
    }
  };

  const handleDelete = (id: number) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setHiddenMeals((prev) => prev.filter((mid) => mid !== id));
    toast.success(t('تم حذف الطبق', 'Meal deleted'));
    setConfirmDelete(null);
  };

  const handleToggleHide = (id: number) => {
    setHiddenMeals((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
    toast.success(
      hiddenMeals.includes(id)
        ? t('تم إظهار الطبق', 'Meal shown')
        : t('تم إخفاء الطبق', 'Meal hidden')
    );
  };

  return (
    <div>
      {/* العنوان + زر الإضافة */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-ruqaa text-2xl text-gradient-gold flex items-center gap-2 mb-1">
            <Package size={24} /> {t('قائمتي', 'My Menu')}
          </h2>
          <p
            className="font-tajawal text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {meals.length} {t('طبق', 'dishes')} •{' '}
            {hiddenMeals.length} {t('مخفي', 'hidden')}
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-tajawal font-bold text-sm transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
            color: '#0F2419',
          }}
        >
          <Plus size={18} /> {t('إضافة طبق', 'Add Dish')}
        </button>
      </div>

      {/* التبويبات */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className="px-4 py-2 rounded-full font-tajawal text-sm font-bold whitespace-nowrap transition-all"
            style={{
              background:
                tab === tb.key
                  ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                  : 'rgba(255, 255, 255, 0.08)',
              color: tab === tb.key ? '#0F2419' : 'rgba(255, 255, 255, 0.7)',
              border:
                tab === tb.key
                  ? 'none'
                  : '1px solid rgba(201, 162, 39, 0.25)',
            }}
          >
            {lang === 'ar' ? tb.ar : tb.en}
          </button>
        ))}
      </div>

      {/* الشبكة */}
      {filteredMeals.length === 0 ? (
        <div className="text-center py-16">
          <Package
            size={48}
            className="mx-auto mb-4"
            style={{ color: 'rgba(201, 162, 39, 0.3)' }}
          />
          <p
            className="font-tajawal text-lg"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {t('لا توجد أطباق هنا', 'No meals here')}
          </p>
          <button
            onClick={handleAdd}
            className="mt-4 px-6 py-3 rounded-full font-tajawal font-bold"
            style={{
              background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
              color: '#0F2419',
            }}
          >
            <Plus size={18} className="inline mr-2" />
            {t('أضف أول طبق', 'Add your first dish')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map((meal) => (
            <MealCardCook
              key={meal.id}
              meal={meal}
              hidden={hiddenMeals.includes(meal.id)}
              onEdit={() => handleEdit(meal)}
              onDelete={() => setConfirmDelete(meal.id)}
              onToggleHide={() => handleToggleHide(meal.id)}
            />
          ))}
        </div>
      )}

      {/* نافذة الإضافة/التعديل */}
      <AddMealModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingMeal}
      />

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {confirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl p-6 text-center"
              style={{
                background: 'linear-gradient(135deg, #0F2419, #1B4332)',
                border: '2px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <AlertCircle
                size={48}
                className="mx-auto mb-4"
                style={{ color: '#f87171' }}
              />
              <h3
                className="font-ruqaa text-2xl mb-2"
                style={{ color: '#FFFFFF' }}
              >
                {t('تأكيد الحذف', 'Confirm Delete')}
              </h3>
              <p
                className="font-tajawal text-sm mb-6"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {t(
                  'هل أنت متأكد من حذف هذا الطبق؟',
                  'Are you sure you want to delete this dish?'
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-full font-tajawal font-bold"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-3 rounded-full font-tajawal font-bold"
                  style={{ background: '#ef4444', color: '#FFFFFF' }}
                >
                  {t('حذف', 'Delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}