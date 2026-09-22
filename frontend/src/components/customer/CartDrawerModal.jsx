import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, HeartHandshake, CheckCircle2, Calendar, Users, Utensils } from 'lucide-react';

export default function CartDrawerModal({ onClose }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart, orderType, setOrderType } = useCart();
  const [donateSurplus, setDonateSurplus] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const finalTotal = donateSurplus ? cartTotal + 2000 : cartTotal;

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12, marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag color="#d97706" size={22} /> سلة تسوق نكهة البصرة
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        {isOrdered ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={60} color="#059669" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46' }}>تم استلام طلبك بنجاح! 🎉</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: 8 }}>
              جاري توجيه طلبك للطباخ وتحضيره بشوق لمذاق البصرة الأصيل.
            </p>
            {donateSurplus && (
              <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 10, border: '1px solid #bbf7d0', marginTop: 16, fontSize: '0.85rem', color: '#166534' }}>
                💚 شكرًا لمساهمتك بمبلغ 2,000 د.ع لصالح جسر التبرع الخيرية (Surplus-to-Charity)!
              </div>
            )}
            <button
              onClick={onClose}
              style={{ background: '#d97706', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, marginTop: 24 }}
            >
              متابعة التصفح
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <ShoppingBag size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>سلتك فارغة حالياً</p>
            <p style={{ fontSize: '0.85rem' }}>تصفح الأكلات البصرية وأضف ما يشتهيه ذوقك!</p>
          </div>
        ) : (
          <>
            {/* Select Order Type */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
                نوع الطلب:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <button
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: orderType === 'standard' ? '#d97706' : '#cbd5e1',
                    background: orderType === 'standard' ? '#fff7ed' : '#fff',
                    color: orderType === 'standard' ? '#b45309' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                  onClick={() => setOrderType('standard')}
                >
                  <Utensils size={14} /> عادي
                </button>
                <button
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: orderType === 'scheduled' ? '#d97706' : '#cbd5e1',
                    background: orderType === 'scheduled' ? '#fff7ed' : '#fff',
                    color: orderType === 'scheduled' ? '#b45309' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                  onClick={() => setOrderType('scheduled')}
                >
                  <Calendar size={14} /> مجدول
                </button>
                <button
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: orderType === 'group' ? '#d97706' : '#cbd5e1',
                    background: orderType === 'group' ? '#fff7ed' : '#fff',
                    color: orderType === 'group' ? '#b45309' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                  }}
                  onClick={() => setOrderType('group')}
                >
                  <Users size={14} /> جماعي
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: 10, borderRadius: 10, border: '1px solid #f1f5f9' }}>
                  <img src={item.image} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.cookName}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706' }}>
                      {(item.price * item.quantity).toLocaleString()} د.ع
                    </div>
                  </div>

                  {/* Qty Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{ width: 26, height: 26, borderRadius: 6, background: '#e2e8f0', border: 'none', fontWeight: 700 }}
                    >-</button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, width: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{ width: 26, height: 26, borderRadius: 6, background: '#e2e8f0', border: 'none', fontWeight: 700 }}
                    >+</button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: 4 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Surplus to Charity Bridge Toggle */}
            <div style={{ background: '#f0fdf4', padding: 12, borderRadius: 10, border: '1px solid #bbf7d0', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={donateSurplus}
                  onChange={(e) => setDonateSurplus(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#16a34a' }}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <HeartHandshake size={16} /> تبرع بوجبة فائضة (Surplus-to-Charity Bridge)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                    إضافة 2,000 د.ع لتمويل وجبة للجمعيات الخيرية المتعففة في البصرة.
                  </div>
                </div>
              </label>
            </div>

            {/* Total Footer */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#64748b' }}>
                <span>مجموع الوجبات:</span>
                <span>{cartTotal.toLocaleString()} د.ع</span>
              </div>
              {donateSurplus && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: '#15803d' }}>
                  <span>مساهمة خيريّة:</span>
                  <span>+2,000 د.ع</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                <span>المبلغ الإجمالي:</span>
                <span style={{ color: '#d97706' }}>{finalTotal.toLocaleString()} د.ع</span>
              </div>

              <button
                onClick={handleCheckout}
                style={{ width: '100%', background: '#d97706', color: 'white', padding: 12, borderRadius: 12, fontSize: '1rem', fontWeight: 800, border: 'none' }}
              >
                تأكيد الطلب ودفع النقد عند الاستلام 🛵
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
