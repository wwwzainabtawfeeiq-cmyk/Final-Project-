import React, { useState } from 'react';
import { Calculator, DollarSign, CheckCircle, Info } from 'lucide-react';

export default function FairPriceCalculator() {
  const [ingredientsCost, setIngredientsCost] = useState(8000);
  const [prepHours, setPrepHours] = useState(1.5);
  const [hourlyWage, setHourlyWage] = useState(5000); // 5000 ID per hour
  const [packagingCost, setPackagingCost] = useState(1500);
  const [desiredProfitMargin, setDesiredProfitMargin] = useState(25); // 25%

  const laborCost = prepHours * hourlyWage;
  const baseCost = ingredientsCost + laborCost + packagingCost;
  const platformFee = Math.round(baseCost * 0.05); // 5% platform fee
  const recommendedPrice = Math.round(baseCost * (1 + desiredProfitMargin / 100) + platformFee);
  const netProfit = recommendedPrice - baseCost - platformFee;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 750, margin: '0 auto' }}>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 28, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ background: '#fef3c7', padding: 10, borderRadius: 12 }}>
            <Calculator color="#d97706" size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
              حاسبة السعر العادل (Fair Price Calculator ⚖️)
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              احسبي تكلفة المكونات والوقت والجهد لضمان تحديد سعر عادل ومربح يراعي الجودة وميزانية الزبون.
            </p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
          {/* Ingredients Cost */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              تكلفة المكونات والسمك/اللحم (د.ع):
            </label>
            <input
              type="number"
              value={ingredientsCost}
              onChange={(e) => setIngredientsCost(Number(e.target.value))}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Prep Hours */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              وقت التحضير والطبخ (بالساعات):
            </label>
            <input
              type="number"
              step="0.5"
              value={prepHours}
              onChange={(e) => setPrepHours(Number(e.target.value))}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Hourly Wage */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              تقدير قيمة جهدك باللساعة (د.ع):
            </label>
            <input
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(Number(e.target.value))}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Packaging Cost */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              تكلفة التغليف والأكياس (د.ع):
            </label>
            <input
              type="number"
              value={packagingCost}
              onChange={(e) => setPackagingCost(Number(e.target.value))}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Calculation Result Box */}
        <div style={{ background: '#fff7ed', border: '1px solid #fde68a', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#78350f' }}>
            <span>إجمالي التكلفة التشغيلية (المواد + الجهد):</span>
            <span>{baseCost.toLocaleString()} د.ع</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: '#78350f' }}>
            <span>عمولة المنصة (5%):</span>
            <span>{platformFee.toLocaleString()} د.ع</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem', color: '#15803d', fontWeight: 700 }}>
            <span>صافي الربح المتوقع للطباخ:</span>
            <span>+{netProfit.toLocaleString()} د.ع</span>
          </div>

          <div style={{ borderTop: '1px solid #fde68a', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400e' }}>
              السعر المقترح للوجبة (Fair Price):
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>
              {recommendedPrice.toLocaleString()} د.ع
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
