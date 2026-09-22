import React, { useState } from 'react';
import { ShieldCheck, Users, ChefHat, ShoppingBag, HeartHandshake, CheckCircle } from 'lucide-react';
import { MOCK_COOKS } from '../../mockData/data';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview | cooks | orders | features | reports
  const [cooks, setCooks] = useState(MOCK_COOKS);

  const toggleVerifyCook = (cookId) => {
    setCooks(prev => prev.map(c => c.id === cookId ? { ...c, isVerified: !c.isVerified } : c));
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Admin Header with Shanasheel Theme */}
      <div style={{
        background: 'linear-gradient(135deg, #3d2413 0%, #153817 50%, #0a4d79 100%)',
        color: 'white',
        borderRadius: 22,
        padding: 28,
        marginBottom: 28,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        border: '2px solid #d4a373',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(212, 163, 115, 0.25)',
            color: '#fef3c7',
            padding: '4px 14px',
            borderRadius: 20,
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: 10,
            border: '1px solid rgba(233, 196, 106, 0.4)'
          }}>
            <ShieldCheck size={14} color="#e9c46a" /> لوحة الإشراف العليا - أدمن نكهة البصرة 🛡️
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#faf6ee' }}>
            إدارة المنصة والرقابة الشاملة (Admin Portal)
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'النظرة العامة' },
            { id: 'cooks', label: 'توثيق الطباخين' },
            { id: 'orders', label: 'مراقبة الطلبات' },
            { id: 'features', label: 'الميزات والتحديات' },
            { id: 'reports', label: 'البلاغات والتقارير' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                fontSize: '0.85rem',
                fontWeight: 800,
                border: '1px solid',
                borderColor: activeTab === t.id ? '#e9c46a' : 'transparent',
                background: activeTab === t.id ? '#5c3a21' : 'rgba(255,255,255,0.12)',
                color: 'white',
                transition: 'all 0.2s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#6e5849', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                <span>إجمالي المستخدمين</span>
                <Users size={20} color="#0e6ba8" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5c3a21', marginTop: 8 }}>1,420 زبون</div>
            </div>

            <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#6e5849', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                <span>الطباخون المسجلون</span>
                <ChefHat size={20} color="#2d5a27" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2d5a27', marginTop: 8 }}>48 طباخ بصري</div>
            </div>

            <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#6e5849', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                <span>إجمالي الطلبات</span>
                <ShoppingBag size={20} color="#5c3a21" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5c3a21', marginTop: 8 }}>3,890 طلب</div>
            </div>

            <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.85rem', color: '#6e5849', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                <span>حصيلة التبرعات (Charity)</span>
                <HeartHandshake size={20} color="#16a34a" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', marginTop: 8 }}>4,250,000 د.ع</div>
            </div>
          </div>

          {/* Quick Actions & Verification Queue preview */}
          <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#5c3a21', marginBottom: 16 }}>
              مركز حوكمة وتوثيق الطباخين (Cook Verification Center):
            </h3>

            {cooks.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: '#6e5849' }}>لا يوجد طلبات توثيق معلقة حالياً.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cooks.map(cook => (
                  <div key={cook.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfaf4', padding: 14, borderRadius: 14, border: '1px solid #e6d5c3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={cook.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#5c3a21' }}>{cook.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6e5849' }}>{cook.location} • {cook.specialty}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleVerifyCook(cook.id)}
                      style={{
                        background: cook.isVerified ? '#f0fdf4' : '#5c3a21',
                        color: cook.isVerified ? '#14532d' : 'white',
                        border: cook.isVerified ? '1.5px solid #86efac' : 'none',
                        padding: '8px 16px',
                        borderRadius: 10,
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {cook.isVerified ? <CheckCircle size={14} /> : <ShieldCheck size={14} />}
                      {cook.isVerified ? 'موثق (Verified)' : 'منح التوثيق'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div style={{ background: 'white', border: '1.5px solid #e6d5c3', borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#5c3a21', marginBottom: 16 }}>
            لوحة التحكم بميزات ونظام المنصة (Modules & Features Manager)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { title: 'Basra Night Food 🌙', status: 'نشط تلقائياً (6 مساءً - 5 صباحاً)' },
              { title: 'Breakfast in Basra ☀️', status: 'نشط تلقائياً (5 صباحاً - 11 صباحاً)' },
              { title: 'Flavor Match AI 🎯', status: 'نشط بكامل الخوارزميات' },
              { title: 'Surplus-to-Charity Bridge 💚', status: 'نشط مع الجمعيات الخيرية' },
              { title: 'Chef-to-Chef Barter 🔄', status: 'نشط' },
              { title: 'Secret Recipe Marketplace 📜', status: 'نشط' }
            ].map((f, i) => (
              <div key={i} style={{ background: '#fdfaf4', padding: 16, borderRadius: 14, border: '1px solid #e6d5c3' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#5c3a21' }}>{f.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 800, marginTop: 4 }}>{f.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
