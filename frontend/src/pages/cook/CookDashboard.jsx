import React, { useState } from 'react';
import { ChefHat, ShieldCheck, ShoppingBag, DollarSign, Star, PlusCircle, Calculator, RefreshCw, BookOpen, HeartHandshake } from 'lucide-react';

export default function CookDashboard({ onOpenAddMeal, onNavigateCookTab }) {
  const [isVerified, setIsVerified] = useState(true);

  return (
    <div className="animate-fade-in">
      {/* Cook Welcome Header with Shanasheel & Palm Theme */}
      <div style={{
        background: 'linear-gradient(135deg, #462b18 0%, #2d5a27 100%)',
        color: 'white',
        borderRadius: 22,
        padding: 30,
        marginBottom: 28,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        boxShadow: '0 10px 25px rgba(70, 43, 24, 0.2)',
        border: '2px solid #d4a373'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(212, 163, 115, 0.25)',
            color: '#fef3c7',
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: 10,
            border: '1px solid rgba(233, 196, 106, 0.4)'
          }}>
            <ChefHat size={14} /> لوحة تحكم مطبخ البصرة الأصيل 🌴
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 6, color: '#faf6ee' }}>
            أهلاً بك في لوحة إدارة المطبخ البصري 👨‍🍳
          </h1>
          <p style={{ fontSize: '0.92rem', opacity: 0.9, color: '#f4eae0' }}>
            مطبخك جاهز لاستقبال وتلبية الطلبات العادية والمجدولة، وإدارة حاسبة السعر العادل وسوق المقايضة!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isVerified ? (
            <div style={{
              background: '#f0fdf4',
              color: '#14532d',
              border: '1.5px solid #86efac',
              padding: '8px 16px',
              borderRadius: 12,
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <ShieldCheck size={18} color="#16a34a" /> Verified Cook 🎖️ (طباخ موثوق)
            </div>
          ) : (
            <button
              onClick={() => setIsVerified(true)}
              style={{
                background: '#d4a373',
                color: '#3d2413',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 12,
                fontSize: '0.88rem',
                fontWeight: 900
              }}
            >
              طلب التوثيق للحصول على Verified Badge
            </button>
          )}

          <button
            onClick={onOpenAddMeal}
            style={{
              background: '#5c3a21',
              color: 'white',
              border: '1px solid #d4a373',
              padding: '10px 20px',
              borderRadius: 12,
              fontSize: '0.9rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
            }}
          >
            <PlusCircle size={18} /> إضافة وجبة جديدة
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e5849', fontSize: '0.85rem', fontWeight: 800 }}>
            <span>مبيعات الشهر</span>
            <DollarSign size={20} color="#5c3a21" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2d5a27', marginTop: 8 }}>850,000 د.ع</div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>+18% نمو المبيعات</div>
        </div>

        <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e5849', fontSize: '0.85rem', fontWeight: 800 }}>
            <span>الطلبات الواردة</span>
            <ShoppingBag size={20} color="#0e6ba8" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5c3a21', marginTop: 8 }}>4 طلبات</div>
          <div style={{ fontSize: '0.8rem', color: '#0e6ba8', fontWeight: 700, marginTop: 4 }}>2 مجدولة، 2 عادية</div>
        </div>

        <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e5849', fontSize: '0.85rem', fontWeight: 800 }}>
            <span>معدل التقييم</span>
            <Star size={20} fill="#d4a373" color="#d4a373" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5c3a21', marginTop: 8 }}>4.9 / 5.0</div>
          <div style={{ fontSize: '0.8rem', color: '#6e5849', marginTop: 4 }}>من أصل 128 تقييم بصري</div>
        </div>

        <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6e5849', fontSize: '0.85rem', fontWeight: 800 }}>
            <span>الوجبات المنقذة (Surplus)</span>
            <HeartHandshake size={20} color="#2d5a27" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2d5a27', marginTop: 8 }}>14 وجبة</div>
          <div style={{ fontSize: '0.8rem', color: '#2d5a27', fontWeight: 700, marginTop: 4 }}>تحويل للتبرع الخيري</div>
        </div>
      </div>

      {/* Cook Quick Tools Grid */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#5c3a21', marginBottom: 18 }}>
        🛠️ أدوات وخدمات المطبخ البصري (Cook Tools):
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {/* Fair Price Calculator */}
        <div
          onClick={() => onNavigateCookTab('fair-price')}
          style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ background: '#fff7ed', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: '1px solid #fed7aa' }}>
            <Calculator color="#5c3a21" size={26} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#5c3a21', marginBottom: 6 }}>
            حاسبة السعر العادل (Fair Price Calculator ⚖️)
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#6e5849', lineHeight: 1.5 }}>
            حساب تكلفة المكونات والجهد والوقت لضمان تحديد سعر عادل ومربح.
          </p>
        </div>

        {/* Chef-to-Chef Barter */}
        <div
          onClick={() => onNavigateCookTab('barter')}
          style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ background: '#f0fdf4', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: '1px solid #bbf7d0' }}>
            <RefreshCw color="#2d5a27" size={26} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2d5a27', marginBottom: 6 }}>
            سوق مقايضة الطباخين (Chef Barter 🔄)
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#6e5849', lineHeight: 1.5 }}>
            تبادل المكونات النادرة (كاللومي والبهارات) والخدمات بين طباخي البصرة.
          </p>
        </div>

        {/* Secret Recipes Marketplace */}
        <div
          onClick={() => onNavigateCookTab('secret-recipes')}
          style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
        >
          <div style={{ background: '#f0f9ff', width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, border: '1px solid #bae6fd' }}>
            <BookOpen color="#0e6ba8" size={26} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0e6ba8', marginBottom: 6 }}>
            متجر الوصفات السرية (Secret Recipe 📜)
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#6e5849', lineHeight: 1.5 }}>
            عرض وبيع خلطات بهاراتك وتتبيلاتك السرية للزبائن وعشاق الطبخ.
          </p>
        </div>
      </div>
    </div>
  );
}
