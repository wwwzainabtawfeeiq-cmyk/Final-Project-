import React, { useState } from 'react';
import { ChefHat, ShieldCheck, TrendingUp, ShoppingBag, DollarSign, Star, PlusCircle, Calculator, RefreshCw, BookOpen, HeartHandshake } from 'lucide-react';
import AddEditMealModal from './AddEditMealModal';

export default function CookDashboard({ onOpenAddMeal, onNavigateCookTab }) {
  const [isVerified, setIsVerified] = useState(true);

  return (
    <div className="animate-fade-in">
      {/* Cook Welcome Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: 'white', borderRadius: 20, padding: 28, marginBottom: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700, marginBottom: 10 }}>
            <ChefHat size={14} /> لوحة تحكم الطباخ البصري
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 6 }}>
            أهلاً بك، أم أحمد البصرية 👩‍🍳
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            مطبخك جاهز لاستقبال الطلبات العادية والمجدولة، وإدارة الفائض والوصفات السرية!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isVerified ? (
            <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '8px 16px', borderRadius: 12, fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={18} color="#059669" /> Verified Cook 🎖️ (طباخ موثوق)
            </div>
          ) : (
            <button
              onClick={() => setIsVerified(true)}
              style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 12, fontSize: '0.88rem', fontWeight: 800 }}
            >
              طلب التوثيق الحصول على Verified Badge
            </button>
          )}

          <button
            onClick={onOpenAddMeal}
            style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <PlusCircle size={18} /> إضافة وجبة جديدة
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 32 }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>مبيعات الشهر</span>
            <DollarSign size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>850,000 د.ع</div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: 4 }}>+18% عن الشهر الماضي</div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>الطلبات النشطة</span>
            <ShoppingBag size={18} color="#0d9488" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>4 طلبات</div>
          <div style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: 700, marginTop: 4 }}>2 مجدولة، 2 عادية</div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>معدل التقييم</span>
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>4.9 / 5.0</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>من أصل 128 تقييم بصري</div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>الوجبات المنقذة (Surplus)</span>
            <HeartHandshake size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>14 وجبة</div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>تم تحويلها للتبرع/الخصم</div>
        </div>
      </div>

      {/* Cook Quick Tools Grid */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
        🛠️ أدوات وخدمات الطباخ الخاصة (Cook Tools):
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        {/* Fair Price Calculator */}
        <div
          onClick={() => onNavigateCookTab('fair-price')}
          style={{ background: 'white', border: '1px solid #fde68a', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
        >
          <div style={{ background: '#fef3c7', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Calculator color="#d97706" size={24} />
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>
            حاسبة السعر العادل (Fair Price Calculator)
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            حساب تكلفة المكونات والجهد وضمان تحقيق ربح عادل وشفاف لكل طبق.
          </p>
        </div>

        {/* Chef-to-Chef Barter */}
        <div
          onClick={() => onNavigateCookTab('barter')}
          style={{ background: 'white', border: '1px solid #ccfbf1', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
        >
          <div style={{ background: '#ccfbf1', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <RefreshCw color="#0d9488" size={24} />
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>
            سوق مقايضة الطباخين (Chef-to-Chef Barter)
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            تبادل المكونات النادرة (كاللومي والبهارات) والخدمات بين طباخي البصرة.
          </p>
        </div>

        {/* Secret Recipes Marketplace */}
        <div
          onClick={() => onNavigateCookTab('secret-recipes')}
          style={{ background: 'white', border: '1px solid #fed7aa', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
        >
          <div style={{ background: '#ffedd5', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <BookOpen color="#c2410c" size={24} />
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>
            متجر الوصفات السرية (Secret Recipe)
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            عرض وبيع خلطات بهاراتك وتتبيلاتك السرية للزبائن وعشاق الطبخ.
          </p>
        </div>
      </div>
    </div>
  );
}
