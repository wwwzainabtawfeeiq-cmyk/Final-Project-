import React, { useState } from 'react';
import { ShieldCheck, Users, ChefHat, ShoppingBag, DollarSign, HeartHandshake, Award, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { MOCK_COOKS, MOCK_MEALS } from '../../mockData/data';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview | cooks | orders | features | reports
  const [cooks, setCooks] = useState(MOCK_COOKS);

  const toggleVerifyCook = (cookId) => {
    setCooks(prev => prev.map(c => c.id === cookId ? { ...c, isVerified: !c.isVerified } : c));
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Admin Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: 'white', borderRadius: 20, padding: 26, marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700, marginBottom: 10 }}>
            <ShieldCheck size={14} color="#818cf8" /> لوحة الإشراف العليا - أدمن نكهة البصرة
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            إدارة المنصة والرقابة الشاملة (Admin Portal 🛡️)
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['overview', 'cooks', 'orders', 'features', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                background: activeTab === tab ? '#818cf8' : 'rgba(255,255,255,0.1)',
                color: 'white'
              }}
            >
              {tab === 'overview' && 'النظرة العامة'}
              {tab === 'cooks' && 'توثيق الطباخين'}
              {tab === 'orders' && 'مراقبة الطلبات'}
              {tab === 'features' && 'الميزات والتحديات'}
              {tab === 'reports' && 'البلاغات والتقارير'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 32 }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>إجمالي المستخدمين</span>
                <Users size={18} color="#818cf8" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>1,420 زبون</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>الطباخون المسجلون</span>
                <ChefHat size={18} color="#0d9488" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>48 طباخ بصري</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>إجمالي الطلبات المنفذة</span>
                <ShoppingBag size={18} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: 8 }}>3,890 طلب</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>حصيلة التبرعات (Charity)</span>
                <HeartHandshake size={18} color="#16a34a" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: 8 }}>4,250,000 د.ع</div>
            </div>
          </div>

          {/* Quick Actions & Verification Queue preview */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 14 }}>
              طلبات توثيق الطباخين المعلقة (Pending Cook Verifications):
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cooks.map(cook => (
                <div key={cook.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={cook.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{cook.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{cook.location} • {cook.specialty}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleVerifyCook(cook.id)}
                    style={{
                      background: cook.isVerified ? '#ecfdf5' : '#d97706',
                      color: cook.isVerified ? '#047857' : 'white',
                      border: cook.isVerified ? '1px solid #a7f3d0' : 'none',
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {cook.isVerified ? <CheckCircle size={14} /> : <ShieldCheck size={14} />}
                    {cook.isVerified ? 'موثق (Verified)' : 'منح التوثيق'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Cook Verification Tab */}
      {activeTab === 'cooks' && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
            مركز حوكمة وتوثيق الطباخين (Cook Verification Center)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
            فحص شهادات السلامة الصحية ومراجعة صور المطابخ لمنح شارة Verified Cook.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cooks.map(cook => (
              <div key={cook.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{cook.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الطلبات المنفذة: {cook.totalOrdersCompleted}</div>
                </div>
                <button
                  onClick={() => toggleVerifyCook(cook.id)}
                  style={{
                    background: cook.isVerified ? '#10b981' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {cook.isVerified ? 'إلغاء التوثيق' : 'تأكيد منح Verified Badge'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
            التحكم بميزات المنصة (Features & Modules Control Panel)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { title: 'Basra Night Food 🌙', status: 'نشط تلقائياً (6 مساءً - 5 صباحاً)' },
              { title: 'Breakfast in Basra ☀️', status: 'نشط تلقائياً (5 صباحاً - 11 صباحاً)' },
              { title: 'Flavor Match AI 🎯', status: 'نشط بكامل الخوارزميات' },
              { title: 'Surplus-to-Charity Bridge 💚', status: 'نشط مع 4 جمعيات بصريّة' },
              { title: 'Chef-to-Chef Barter 🔄', status: 'نشط' },
              { title: 'Secret Recipe Marketplace 📜', status: 'نشط' }
            ].map((f, i) => (
              <div key={i} style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginTop: 4 }}>{f.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
