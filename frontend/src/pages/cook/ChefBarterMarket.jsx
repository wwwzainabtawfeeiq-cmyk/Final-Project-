import { useState } from 'react';
import { RefreshCw, PlusCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { MOCK_BARTER_ITEMS } from '../../mockData/data';

export default function ChefBarterMarket() {
  const [items, setItems] = useState(MOCK_BARTER_ITEMS);
  const [offerText, setOfferText] = useState('');
  const [seekingText, setSeekingText] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddBarter = (e) => {
    e.preventDefault();
    const newItem = {
      id: `b${items.length + 1}`,
      cookName: "أم أحمد البصرية",
      offer: offerText,
      seeking: seekingText,
      status: "متاح للتبادل",
      date: "الآن"
    };
    setItems([newItem, ...items]);
    setOfferText('');
    setSeekingText('');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 850, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: 'white', padding: '24px', borderRadius: 20, marginBottom: 24, textAlign: 'center' }}>
        <RefreshCw size={36} style={{ margin: '0 auto 8px' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>
          سوق مقايضة الطباخين (Chef-to-Chef Barter 🔄)
        </h1>
        <p style={{ fontSize: '0.88rem', opacity: 0.9 }}>
          تبادل المكونات النادرة، البهارات البصرية، أو المهارات وأدوات الطبخ مع زملاءك الطباخين في البصرة بدون استخدام المال!
        </p>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, marginBottom: 28 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 14 }}>
          إدراج عرض مقايضة جديد:
        </h3>

        {isAdded && (
          <div style={{ background: '#ecfdf5', color: '#065f46', padding: 10, borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, marginBottom: 14 }}>
            <CheckCircle size={14} inline style={{ marginLeft: 4 }} /> تم نشر عرض المقايضة لسوق الطباخين!
          </div>
        )}

        <form onSubmit={handleAddBarter}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                ماذا تقدم للمقايضة؟ (Offer):
              </label>
              <input
                type="text"
                placeholder="مثال: 5 كغم لومي بصري ممتاز أو بهارات كاري معتقة..."
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                required
                style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                ماذا تطلب بالمقابل؟ (Seeking):
              </label>
              <input
                type="text"
                placeholder="مثال: 10 كغم تمن عنبر أو مساعدة في تغليف الطلبات..."
                value={seekingText}
                onChange={(e) => setSeekingText(e.target.value)}
                required
                style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ background: '#0d9488', color: 'white', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <PlusCircle size={16} /> نشر العرض للمقايضة
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 800, color: '#0d9488', fontSize: '0.95rem' }}>{item.cookName}</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.date}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: '#f0fdf4', padding: 10, borderRadius: 8, border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, display: 'block' }}>المُقدّم:</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#14532d' }}>{item.offer}</span>
              </div>
              <div style={{ background: '#fff7ed', padding: 10, borderRadius: 8, border: '1px solid #fed7aa' }}>
                <span style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700, display: 'block' }}>المطلوب:</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#7c2d12' }}>{item.seeking}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`تم بدء محادثة المقايضة مع ${item.cookName}`)}
              style={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <MessageSquare size={14} /> تواصل لبدء المقايضة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
