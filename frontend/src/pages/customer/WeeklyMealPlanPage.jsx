import React, { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function WeeklyMealPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState({
    'الأحد': { breakfast: null, lunch: null, dinner: null },
    'الإثنين': { breakfast: null, lunch: null, dinner: null },
    'الثلاثاء': { breakfast: null, lunch: null, dinner: null },
    'الأربعاء': { breakfast: null, lunch: null, dinner: null },
    'الخميس': { breakfast: null, lunch: null, dinner: null },
    'الجمعة': { breakfast: null, lunch: null, dinner: null },
    'السبت': { breakfast: null, lunch: null, dinner: null },
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleRemoveMeal = (day, mealType) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: null }
    }));
  };

  const handleSavePlan = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: 'white', padding: '28px 24px', borderRadius: 20, marginBottom: 24, textAlign: 'center' }}>
        <Calendar size={36} style={{ margin: '0 auto 10px' }} />
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
          خطة الوجبات الأسبوعية (Weekly Meal Plan 📅)
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, maxWidth: 650, margin: '0 auto' }}>
          خطط وجباتك للأسبوع كاملاً مسبقاً وسيقوم النظام بتأكيد وتجهيز كل وجبة في وقتها المحدد!
        </p>
      </div>

      {isSaved && (
        <div style={{ background: '#ecfdf5', padding: 12, borderRadius: 12, border: '1px solid #6ee7b7', color: '#065f46', textAlign: 'center', marginBottom: 20, fontWeight: 700 }}>
          <CheckCircle2 size={18} inline style={{ marginLeft: 6 }} /> تم حفظ جدولك الأسبوعي!
        </div>
      )}

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 28 }}>
        {DAYS.map(day => {
          const plan = weeklyPlan[day];
          return (
            <div key={day} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#fff7ed', padding: '6px 12px', borderRadius: 8, fontWeight: 800, color: '#b45309', fontSize: '0.95rem', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{day}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#d97706' }}>جدول يومي</span>
              </div>

              {/* Breakfast Slot */}
              <div style={{ marginBottom: 10, padding: 8, background: '#f8fafc', borderRadius: 8, border: '1px border-dashed #cbd5e1' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>☀️ الإفطار:</span>
                {plan.breakfast ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{plan.breakfast.title}</span>
                    <button onClick={() => handleRemoveMeal(day, 'breakfast')} style={{ background: 'none', border: 'none', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>لا يوجد إفطار مضاف</span>
                )}
              </div>

              {/* Lunch Slot */}
              <div style={{ marginBottom: 10, padding: 8, background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>🍚 الغداء:</span>
                {plan.lunch ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{plan.lunch.title}</span>
                    <button onClick={() => handleRemoveMeal(day, 'lunch')} style={{ background: 'none', border: 'none', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>لا يوجد غداء مضاف</span>
                )}
              </div>

              {/* Dinner Slot */}
              <div style={{ padding: 8, background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'block' }}>🌙 العشاء:</span>
                {plan.dinner ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{plan.dinner.title}</span>
                    <button onClick={() => handleRemoveMeal(day, 'dinner')} style={{ background: 'none', border: 'none', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: 4 }}>لا يوجد عشاء مضاف</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSavePlan}
        style={{ width: '100%', background: '#d97706', color: 'white', padding: 14, borderRadius: 14, fontSize: '1.05rem', fontWeight: 800, border: 'none' }}
      >
        حفظ الخطة الأسبوعية 📅
      </button>
    </div>
  );
}
