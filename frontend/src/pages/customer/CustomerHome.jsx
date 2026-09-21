import React from 'react';
import { MOCK_MEALS } from '../../mockData/data';
import MealCard from '../../components/customer/MealCard';
import { Sparkles, Moon, Sun, Utensils } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CustomerHome({ searchTerm, activeCategory, setActiveCategory, onOpenFlavorMatch }) {
  const { favorites } = useCart();
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 5;

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'مأكولات بحرية', label: 'مأكولات بحرية 🐟' },
    { id: 'أطباق رئيسية', label: 'أطباق رئيسية 🍲' },
    { id: 'إفطار بصري', label: 'إفطار بصري ☀️' },
    { id: 'أكلات ليلية', label: 'أكلات ليلية 🌙' },
    { id: 'مسقوف وبحري', label: 'مسقوف وبحري 🪵' },
    { id: 'إنقاذ الطعام', label: 'إنقاذ الطعام 💚' }
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
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        borderRadius: 24,
        padding: '36px 30px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <div style={{ maxWidth: 640, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700, marginBottom: 14, border: '1px solid rgba(251, 191, 36, 0.3)' }}>
            <Sparkles size={14} /> نكهات بصرية أصيلة
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
            استمتع بنكهة <span style={{ color: '#f59e0b' }}>البصرة الحقيقية</span> 🌊
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.85, marginBottom: 24, lineHeight: 1.6 }}>
            من سمك المسقوف على حطب الغرب إلى قيمر السدة والمطبق البصري الحامض، تصفح واطلب وجباتك المخصصة أو جدولها لأسبوعك!
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={onOpenFlavorMatch}
              style={{ background: '#d97706', color: 'white', border: 'none', padding: '12px 22px', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Sparkles size={18} /> جرب Flavor Match الذكي
            </button>
            <button
              onClick={() => setActiveCategory(isNight ? 'night' : 'breakfast')}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {isNight ? <Moon size={16} color="#fbbf24" /> : <Sun size={16} color="#f59e0b" />}
              {isNight ? 'تصفح Basra Night Food' : 'تصفح Breakfast in Basra'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              fontSize: '0.88rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: '1px solid',
              borderColor: activeCategory === cat.id ? '#d97706' : '#e2e8f0',
              background: activeCategory === cat.id ? '#d97706' : 'white',
              color: activeCategory === cat.id ? 'white' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
            قائمة الوجبات المتاحة ({filteredMeals.length}):
          </h2>
        </div>

        {filteredMeals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <Utensils size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b' }}>لم نجد وجبات تطابق بحثك حالياً</p>
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
