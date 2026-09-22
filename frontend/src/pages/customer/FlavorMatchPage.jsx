import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { MOCK_MEALS } from '../../mockData/data';
import MealCard from '../../components/customer/MealCard';

export default function FlavorMatchPage() {
  const [spicyLevel, setSpicyLevel] = useState(2);
  const [sourLevel, setSourLevel] = useState(4);
  const [traditionalLevel, setTraditionalLevel] = useState(5);
  const [budgetLevel, setBudgetLevel] = useState('medium');
  const [isCalculated, setIsCalculated] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleMatch = () => {
    setIsCalculated(true);
    const matches = MOCK_MEALS.filter(m => {
      const spDiff = Math.abs(m.tasteProfile.spicy - spicyLevel);
      const sourDiff = Math.abs(m.tasteProfile.sour - sourLevel);
      return spDiff <= 2 && sourDiff <= 2;
    });
    setRecommendations(matches.length > 0 ? matches : MOCK_MEALS.slice(0, 3));
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '32px 24px', borderRadius: 20, marginBottom: 28, textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', width: 54, height: 54, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <Sparkles size={28} />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
          نظام مطابقة النكهة الذكي (Flavor Match & Taste Profile 🎯)
        </h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>
          حدد تفضيلات نكهتك وميزانيتك، وسيقوم الذكاء الاصطناعي باقتراح أفضل الوجبات البصرية المناسبة لشهيتك!
        </p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24, marginBottom: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 20, borderBottom: '2px solid #fef3c7', paddingBottom: 8 }}>
          بناء ملف الذوق الخاص بك (Taste Profile Builder):
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
              درجة الحرارة (الفلفل والسبايسي): {spicyLevel} / 5 🌶️
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={spicyLevel}
              onChange={(e) => setSpicyLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#e11d48' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>بدون حرارة</span>
              <span>حار جداً</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
              درجة الحموضة (اللومي والتمور البصرية): {sourLevel} / 5 🍋
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={sourLevel}
              onChange={(e) => setSourLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0d9488' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>عادي</span>
              <span>حامض بصري أصيل</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
              الأصالة (تقليدي بصري vs عصري): {traditionalLevel} / 5 🏺
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={traditionalLevel}
              onChange={(e) => setTraditionalLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#d97706' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>عصري وسريع</span>
              <span>تراث بصري قديم</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
              فئة الميزانية 💰
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'low', label: 'اقتصادية (< 8,000)' },
                { id: 'medium', label: 'متوسطة (8-15 ألف)' },
                { id: 'high', label: 'فاخرة (> 15 ألف)' }
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => setBudgetLevel(b.id)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: budgetLevel === b.id ? '#d97706' : '#cbd5e1',
                    background: budgetLevel === b.id ? '#fff7ed' : '#fff',
                    color: budgetLevel === b.id ? '#b45309' : '#64748b'
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleMatch}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #d97706 0%, #0d9488 100%)',
            color: 'white',
            padding: '14px',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: 'none'
          }}
        >
          <Sparkles size={18} /> احصل على التوصيات المخصصة لذكائك الذوقي
        </button>
      </div>

      {isCalculated && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
              🎯 الوجبات الأعلى تطابقاً مع ذوقك ({recommendations.length}):
            </h3>
            <button
              onClick={() => setIsCalculated(false)}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RefreshCw size={14} /> إعادة ضبط الذوق
            </button>
          </div>

          <div className="meals-grid">
            {recommendations.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
