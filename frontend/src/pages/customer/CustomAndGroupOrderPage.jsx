import React, { useState } from 'react';
import { Utensils, Users, Copy, Check, Send, Sparkles } from 'lucide-react';

export default function CustomAndGroupOrderPage() {
  const [activeSubTab, setActiveSubTab] = useState('custom'); // 'custom' | 'group'
  
  // Custom Order Form state
  const [cookSpecialty, setCookSpecialty] = useState('مأكولات بحرية ومسقوف');
  const [dishDescription, setDishDescription] = useState('');
  const [servings, setServings] = useState(4);
  const [deliveryDate, setDeliveryDate] = useState('2026-09-22');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Group Order state
  const [groupTitle, setGroupTitle] = useState('غداء العائلة / المكتب');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleCopyGroupLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 850, margin: '0 auto' }}>
      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 14,
            fontWeight: 800,
            fontSize: '1rem',
            border: '1px solid',
            borderColor: activeSubTab === 'custom' ? '#d97706' : '#cbd5e1',
            background: activeSubTab === 'custom' ? '#fff7ed' : '#fff',
            color: activeSubTab === 'custom' ? '#b45309' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          onClick={() => setActiveSubTab('custom')}
        >
          <Utensils size={18} /> طلب خاص بمواصفاتك (Custom / Pre-Order)
        </button>
        <button
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 14,
            fontWeight: 800,
            fontSize: '1rem',
            border: '1px solid',
            borderColor: activeSubTab === 'group' ? '#0d9488' : '#cbd5e1',
            background: activeSubTab === 'group' ? '#f0fdf4' : '#fff',
            color: activeSubTab === 'group' ? '#0f766e' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
          onClick={() => setActiveSubTab('group')}
        >
          <Users size={18} /> طلب جماعي مشترَك (Group Order)
        </button>
      </div>

      {activeSubTab === 'custom' ? (
        <div style={{ background: 'white', padding: 28, borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6, color: '#1e293b' }}>
            طلب وجبة خاصة بمواصفاتك وحسب رغبتك 👨‍🍳
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 20 }}>
            اشرح الوجبة أو المناسبة التي تريدها (مثال: عشاء مسقوف لـ 10 أشخاص بدون ملح زائد مع حوايج بصرية خاصة).
          </p>

          {isSubmitted ? (
            <div style={{ background: '#ecfdf5', padding: 24, borderRadius: 14, border: '1px solid #6ee7b7', textAlign: 'center' }}>
              <Sparkles size={48} color="#059669" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46' }}>تم إرسال طلبك الخاص بنجاح!</h3>
              <p style={{ fontSize: '0.9rem', color: '#047857', marginTop: 6 }}>
                سيتم تقدير السعر وتأكيد تفاصيل التجهيز في الوقت المحدد.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                style={{ marginTop: 16, background: '#059669', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 8, fontWeight: 700 }}
              >
                إرسال طلب خاص آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom}>
              {/* Select Category Specialty */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  نوع المطبخ المطلوبة:
                </label>
                <select
                  value={cookSpecialty}
                  onChange={(e) => setCookSpecialty(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="مأكولات بحرية ومسقوف">مأكولات بحرية ومسقوف</option>
                  <option value="أكلات تقليدية بصرية">أكلات تقليدية بصرية</option>
                  <option value="معجنات وإفطار بصري">معجنات وإفطار بصري</option>
                  <option value="وجبات ليلية">وجبات ليلية</option>
                </select>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                  تفاصيل ومواصفات الوجبة المطلوبة:
                </label>
                <textarea
                  rows={4}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  placeholder="مثال: مطبق بني بصري طازج مع حشو جوز وحوايج بصرية حامضة ومقبلات بصل ولومي..."
                  required
                  style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Servings & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    عدد الأطباق / الأشخاص:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={servings}
                    onChange={(e) => setServings(Number(e.target.value))}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                    تاريخ ووقت التسليم المفضل:
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', background: '#d97706', color: 'white', padding: 12, borderRadius: 10, fontSize: '1rem', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Send size={16} /> إرسال الطلب المخصص
              </button>
            </form>
          )}
        </div>
      ) : (
        <div style={{ background: 'white', padding: 28, borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6, color: '#1e293b' }}>
            إنشاء طلب جماعي (Group Order) 👥
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 20 }}>
            اجمع أصدقاءك أو زملائك بالعمل في سلة واحدة وتشاركوا اختيار الوجبات وتكاليف التوصيل!
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              عنوان المجموعة:
            </label>
            <input
              type="text"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Group Link Share Box */}
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'block', marginBottom: 6 }}>
              رابط المشاركة التفاعلي للمجموعة:
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                readOnly
                value="https://basraflavor.app/group-order/join?code=BASRA-9982"
                style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff', color: '#334155' }}
              />
              <button
                onClick={handleCopyGroupLink}
                style={{ background: copiedLink ? '#10b981' : '#0d9488', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}
              </button>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 10, border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534' }}>
            💡 <strong>كيف تعمل الميزة؟</strong> شارك الرابط أعلاه مع أصدقائك. سيستطيع كل شخص اختيار وجبته المفضلة لتظهر مباشرة في السلة الجماعية مع قسمة التوصيل آلياً!
          </div>
        </div>
      )}
    </div>
  );
}
