import React, { useState } from 'react';
import { HeartHandshake, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';
import { MOCK_MEALS } from '../../mockData/data';
import MealCard from '../../components/customer/MealCard';

export default function SurplusAndCharityPage() {
  const surplusMeals = MOCK_MEALS.filter(m => m.isSurplus);
  const [donorName, setDonorName] = useState('');
  const [donationAmount, setDonationAmount] = useState(5000);
  const [isDonated, setIsDonated] = useState(false);

  const handleDonate = (e) => {
    e.preventDefault();
    setIsDonated(true);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 950, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', color: 'white', padding: '28px 24px', borderRadius: 20, marginBottom: 28, textAlign: 'center' }}>
        <HeartHandshake size={42} style={{ margin: '0 auto 10px' }} />
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
          إنقاذ الطعام وجسر التبرع الخيرية (Surplus-to-Charity Bridge 💚)
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, maxWidth: 650, margin: '0 auto' }}>
          نحمي النعمة في البصرة! تصفح الوجبات الفائضة الطازجة بنصف السعر أو ساهم في تمويل التبرع المباشر للعوائل المتعففة.
        </p>
      </div>

      {/* Section 1: Food Rescue Market */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <ShieldAlert color="#d97706" size={22} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
            وجبات Food Rescue المتاحة بنصف السعر حالياً:
          </h2>
        </div>

        <div className="meals-grid">
          {surplusMeals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>

      {/* Section 2: Direct Charity Bridge Form */}
      <div style={{ background: 'white', border: '1px solid #bbf7d0', borderRadius: 16, padding: 24, boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#14532d', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart color="#e11d48" size={20} /> جسر التبرع المباشر (Surplus-to-Charity Bridge)
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#166534', marginBottom: 20 }}>
          تضمن الميزة نقل الوجبات الفائضة من مطابخ البصرة الموثوقة وتوزيعها بحفظ كرامة المستفيدين عبر مندوبينا السريعين.
        </p>

        {isDonated ? (
          <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 12, border: '1px solid #86efac', textAlign: 'center' }}>
            <CheckCircle2 size={44} color="#16a34a" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#14532d' }}>بارك الله فيك وشكراً لإحسانك! 🙏</h4>
            <p style={{ fontSize: '0.88rem', color: '#166534', marginTop: 4 }}>
              تم استلام مساهمتك بـ {donationAmount.toLocaleString()} د.ع وجاري إعداد الوجبات الخيرية.
            </p>
            <button
              onClick={() => setIsDonated(false)}
              style={{ marginTop: 14, background: '#16a34a', color: 'white', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700 }}
            >
              مساهمة أخرى
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  اسم المساهم (اختياري / فاعل خير):
                </label>
                <input
                  type="text"
                  placeholder="فاعل خير من البصرة"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  مبلغ المساهمة:
                </label>
                <select
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value={3000}>3,000 د.ع (تمويل وجبة واحدة)</option>
                  <option value={5000}>5,000 د.ع (تمويل وجبتين)</option>
                  <option value={10000}>10,000 د.ع (تمويل 4 وجبات عائلية)</option>
                  <option value={25000}>25,000 د.ع (تمويل وجبات أسبوع كامل)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{ width: '100%', background: '#16a34a', color: 'white', padding: 12, borderRadius: 10, fontSize: '1rem', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <HeartHandshake size={18} /> تأكيد المساهمة في جسر الخير 💚
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
