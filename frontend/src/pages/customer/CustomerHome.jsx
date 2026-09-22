import React from 'react';
import { MOCK_MEALS, BASRA_IMAGES } from '../../mockData/data';
import MealCard from '../../components/customer/MealCard';
import { Sparkles, Moon, Sun, Utensils, Compass, Waves } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CustomerHome({ searchTerm, activeCategory, setActiveCategory, onOpenFlavorMatch }) {
  const { favorites } = useCart();
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 5;

  const categories = [
    { id: 'all', label: 'جميع النكهات 🌴' },
    { id: 'مأكولات بحرية', label: 'سمك ومأكولات بحرية 🐟' },
    { id: 'أطباق رئيسية', label: 'مطابخ بصرية عريقة 🍲' },
    { id: 'إفطار بصري', label: 'إفطار وقيمر السدة ☀️' },
    { id: 'أكلات ليلية', label: 'وجبات ليلية فوق الجسر 🌙' },
    { id: 'مسقوف وبحري', label: 'مسقوف شط العرب 🪵' },
    { id: 'إنقاذ الطعام', label: 'إنقاذ النعمة والتبرع 💚' }
  ];

  // Filter meals
  const filteredMeals = MOCK_MEALS.filter(meal => {
    const matchesSearch = meal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meal.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeCategory === 'favorites') {
      return matchesSearch && favorites.includes(meal.id);
    }
    if (activeCategory === 'night') {
      return matchesSearch && meal.isNightFood;
    }
    if (activeCategory === 'breakfast') {
      return matchesSearch && meal.isBreakfast;
    }
    if (activeCategory === 'surplus') {
      return matchesSearch && meal.isSurplus;
    }
    if (activeCategory !== 'all') {
      return matchesSearch && meal.category === activeCategory;
    }
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero Banner with REAL Background Image & Rich Basra Overlay */}
      <div style={{
        backgroundImage: `linear-gradient(135deg, rgba(70, 43, 24, 0.88) 0%, rgba(45, 90, 39, 0.82) 50%, rgba(14, 107, 168, 0.85) 100%), url(${BASRA_IMAGES.shanasheel})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        borderRadius: 24,
        padding: '44px 36px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(70, 43, 24, 0.3)',
        border: '2px solid #d4a373'
      }}>
        <div style={{ maxWidth: 700, position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(212, 163, 115, 0.3)',
            color: '#fef3c7',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: 16,
            border: '1px solid rgba(233, 196, 106, 0.5)',
            backdropFilter: 'blur(6px)'
          }}>
            🌴 الشناشيل الأصيلة • بساتين النخيل • ضفاف شط العرب والجسر الإيطالي 🌉
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.35, marginBottom: 14, color: '#faf6ee' }}>
            نكهات البصرة الحقيقية.. <span style={{ color: '#e9c46a' }}>من بيوت الطباخين إلى مائدتك</span> 🌊
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.95, marginBottom: 28, lineHeight: 1.7, color: '#f4eae0' }}>
            استمتع بعراقة المطبخ البصري مع أكلات السمك المسقوف على حطب الغرب وقيمر السدة والمطبق البصري المعتق باللومي والحوايج.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <button
              onClick={onOpenFlavorMatch}
              style={{
                background: 'linear-gradient(90deg, #d4a373 0%, #e9c46a 100%)',
                color: '#3d2413',
                border: 'none',
                padding: '13px 26px',
                borderRadius: 14,
                fontWeight: 900,
                fontSize: '0.98rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
              }}
            >
              <Sparkles size={18} /> جرب Flavor Match الذكي 🎯
            </button>

            <button
              onClick={() => setActiveCategory(isNight ? 'night' : 'breakfast')}
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '13px 24px',
                borderRadius: 14,
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backdropFilter: 'blur(6px)'
              }}
            >
              {isNight ? <Moon size={16} color="#e9c46a" /> : <Sun size={16} color="#e9c46a" />}
              {isNight ? 'أكلات السهر في البصرة (Basra Night Food) 🌙' : 'ريوق قيمر السدة (Breakfast in Basra) ☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills with Brown & Green Palette */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginBottom: 24 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '10px 20px',
              borderRadius: 22,
              fontSize: '0.9rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              border: '1.5px solid',
              borderColor: activeCategory === cat.id ? '#5c3a21' : '#e6d5c3',
              background: activeCategory === cat.id ? '#5c3a21' : '#ffffff',
              color: activeCategory === cat.id ? '#ffffff' : '#6e5849',
              transition: 'all 0.2s',
              boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(92, 58, 33, 0.2)' : 'none'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Meals Catalog */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#5c3a21', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={22} color="#2d5a27" /> أشهى الأطباق البصرية المتاحة ({filteredMeals.length}):
          </h2>
        </div>

        {filteredMeals.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: '#ffffff',
            borderRadius: 20,
            border: '2px dashed #e6d5c3',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Utensils size={44} color="#d4a373" style={{ margin: '0 auto 14px' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#5c3a21' }}>لا توجد وجبات مضافة حالياً في القائمة</p>
            <p style={{ fontSize: '0.88rem', color: '#6e5849', marginTop: 6 }}>
              سيتم إضافة أشهى الوجبات البصرية الطازجة قريباً جداً 🌴
            </p>
          </div>
        ) : (
          <div className="meals-grid">
            {filteredMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
