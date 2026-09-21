import React from 'react';
import { Trophy, Award, Star, CheckCircle } from 'lucide-react';
import { MOCK_CHALLENGES } from '../../mockData/data';

export default function ChallengesPage() {
  const userBadges = [
    { name: "عاشق المسقوف 🐟", desc: "طلب وجبتين مسقوف بصري", unlocked: true },
    { name: "نجم التبرع 💚", desc: "ساهم في جسر التبرع الخيرية", unlocked: true },
    { name: "صديق النعمة 🌿", desc: "أنقذ 3 وجبات من هدر الطعام", unlocked: false },
    { name: "مستكشف النكهات 🎯", desc: "أكمل اختبار Taste Profile واستخدم التوصيات", unlocked: false }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: 'white', padding: '28px 24px', borderRadius: 20, marginBottom: 28, textAlign: 'center' }}>
        <Trophy size={40} style={{ margin: '0 auto 10px' }} />
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
          تحديات وأوسمة نكهة البصرة (BasraFlavor Challenges 🏆)
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, maxWidth: 650, margin: '0 auto' }}>
          شارك في التحديات البصرية الشعبية، اجمع النقاط، واكسب أوسمة حصرية وخومات على طلباتك القادمة!
        </p>
      </div>

      {/* Badges Showcase */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, marginBottom: 28 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Award color="#d97706" size={20} /> الأوسمة المكتسبة والمتاحة (My Badges):
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {userBadges.map((badge, idx) => (
            <div
              key={idx}
              style={{
                padding: 14,
                borderRadius: 12,
                border: '1px solid',
                borderColor: badge.unlocked ? '#fde68a' : '#e2e8f0',
                background: badge.unlocked ? '#fff7ed' : '#f8fafc',
                textAlign: 'center',
                opacity: badge.unlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>
                {badge.unlocked ? '🏅' : '🔒'}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: badge.unlocked ? '#b45309' : '#64748b' }}>
                {badge.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                {badge.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges List */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>
        🔥 التحديات النشطة حالياً:
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOCK_CHALLENGES.map(ch => {
          const percent = Math.round((ch.progress / ch.target) * 100);
          return (
            <div key={ch.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>{ch.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>{ch.description}</p>
                </div>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800 }}>
                  +{ch.pointsReward} نقطة
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ margin: '14px 0 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  <span>التقدم الحالي: {ch.progress} / {ch.target}</span>
                  <span>{percent}%</span>
                </div>
                <div style={{ width: '100%', height: 10, background: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #d97706 0%, #e11d48 100%)', borderRadius: 5, transition: 'width 0.5s' }} />
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={13} fill="#0d9488" /> مكافأة الإكمال: وسام "{ch.badgeReward}"
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
