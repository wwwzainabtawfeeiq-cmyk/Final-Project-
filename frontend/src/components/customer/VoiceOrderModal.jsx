import { useState } from 'react';
import { Mic, MicOff, X, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { MOCK_MEALS } from '../../mockData/data';

export default function VoiceOrderModal({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedMeal, setDetectedMeal] = useState(null);
  const { addToCart } = useCart();

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('جاري الاستماع لصوتك بالبصرة...');
    setDetectedMeal(null);

    setTimeout(() => {
      setIsListening(false);
      const samplePhrases = [
        "أريد مطبق زبيدي بصري لـ 3 أشخاص",
        "طلب مسقوف حطب للعشاء",
        "كاهي وقيمر سدة بصري طازج للريوق"
      ];
      const randomPhrase = samplePhrases[0];
      setTranscript(`"${randomPhrase}"`);
      setDetectedMeal(MOCK_MEALS[0] || null);
    }, 2500);
  };

  const handleConfirmOrder = () => {
    if (detectedMeal) {
      addToCart(detectedMeal, 1);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card text-center" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, left: 16, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} color="#94a3b8" />
        </button>

        <div style={{ margin: '0 auto 16px', background: '#fef3c7', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mic size={32} color="#d97706" />
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
          الطلب الصوتي (Voice-First Ordering 🎙️)
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: 20 }}>
          تحدث باللغة العربية أو اللهجة البصرية واطلب وجبتك مباشرة بصوتك!
        </p>

        <div style={{ margin: '20px 0' }}>
          <button
            onClick={handleStartListening}
            disabled={isListening}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: isListening ? '#e11d48' : '#d97706',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: isListening ? '0 0 0 12px rgba(225, 29, 72, 0.2)' : '0 4px 14px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            {isListening ? <MicOff size={36} /> : <Mic size={36} />}
          </button>
          <p style={{ fontSize: '0.82rem', marginTop: 10, color: '#94a3b8' }}>
            {isListening ? 'اضغط لإلغاء الاستماع...' : 'اضغط على المايك وابدأ الحديث'}
          </p>
        </div>

        {transcript && (
          <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: 4 }}>
              النص المفهوم:
            </span>
            <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{transcript}</strong>
          </div>
        )}

        {detectedMeal && (
          <div style={{ background: '#ecfdf5', padding: 14, borderRadius: 12, border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'right' }}>
            <img src={detectedMeal.image} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065f46' }}>{detectedMeal.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#047857' }}>السعر: {detectedMeal.price.toLocaleString()} د.ع</div>
            </div>
            <button
              onClick={handleConfirmOrder}
              style={{ background: '#059669', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700 }}
            >
              <CheckCircle size={14} style={{ marginLeft: 4 }} /> إقرار إضافة للسلة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
