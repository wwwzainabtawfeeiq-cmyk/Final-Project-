import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, ChefHat, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const QUICK_SUGGESTIONS = [
  { ar: 'اقترح لي طبقاً للعشاء', en: 'Suggest dinner ideas' },
  { ar: 'أريد شيئاً حاراً', en: 'I want something spicy' },
  { ar: 'ما هي أشهر أطباق البصرة؟', en: 'What are famous Basra dishes?' },
  { ar: 'اقترح حلويات', en: 'Suggest sweets' },
];

// ====== الردود الذكية (Mock AI) ======
const MOCK_RESPONSES: {
  keywords: { ar: string[]; en: string[] };
  response: { ar: string; en: string };
}[] = [
  {
    keywords: {
      ar: ['اقترح', 'اقتراح', 'عشاء', 'غداء', 'فطور'],
      en: ['suggest', 'recommend', 'dinner', 'lunch', 'breakfast', 'idea'],
    },
    response: {
      ar: 'أنصحك بتجربة "مسكوف بصري" من أم أحمد — طبق تراثي أصيل بتقييم 4.9 ⭐. أو إذا أردت شيئاً خفيفاً، جرّب "كباب بصري" من أبو حسين.',
      en: 'I recommend "Basra Masgouf" from Um Ahmed — a traditional dish rated 4.9 ⭐. Or for something lighter, try "Basra Kebab" from Abu Hussein.',
    },
  },
  {
    keywords: {
      ar: ['حار', 'حارة', 'سبايسي', 'حراق'],
      en: ['spicy', 'hot', 'spice', 'chili'],
    },
    response: {
      ar: 'بالنسبة للأطباق الحارة، أنصحك بـ "برياني أبو كرار" — يحتوي على بهارات حارة مميزة 🌶️. سعره 15,000 د.ع.',
      en: 'For spicy dishes, I recommend "Abu Karar Biryani" — it has a special spicy mix 🌶️. Price: 15,000 IQD.',
    },
  },
  {
    keywords: {
      ar: ['حلويات', 'حلو', 'حلوى', 'ديسيرت'],
      en: ['sweet', 'dessert', 'sweets', 'cake'],
    },
    response: {
      ar: 'أشهى الحلويات البصرية: "زلابية بالعسل" (6,000 د.ع) و"باكلوا بالفستق" (9,000 د.ع) من ست نورية — تقييم 5.0 ⭐.',
      en: 'Best Basra sweets: "Zalabia with Honey" (6,000 IQD) and "Pistachio Baklava" (9,000 IQD) from Set Nouria — rated 5.0 ⭐.',
    },
  },
  {
    keywords: {
      ar: ['أشهر', 'مشهور', 'تقليدي', 'بصري', 'تراثي'],
      en: ['famous', 'popular', 'traditional', 'basra', 'iraqi', 'classic'],
    },
    response: {
      ar: 'أشهر أطباق البصرة: 1) المسكوف البصري 🐟 2) القوزي البغدادي 🍖 3) البرياني 🍛 4) التشريب 🥖 5) الزلابية 🍯. كلها متوفرة في المنصة!',
      en: 'Famous Basra dishes: 1) Masgouf 🐟 2) Quzi 🍖 3) Biryani 🍛 4) Tashreeb 🥖 5) Zalabia 🍯. All available on the platform!',
    },
  },
  {
    keywords: {
      ar: ['أرز', 'برياني', 'رز'],
      en: ['rice', 'biryani'],
    },
    response: {
      ar: 'أنصحك بـ "برياني أبو كرار" (15,000 د.ع) أو "تمّن بصري" (13,000 د.ع) — كلاهما بتقييم عالٍ.',
      en: 'I recommend "Abu Karar Biryani" (15,000 IQD) or "Basra Rice" (13,000 IQD) — both highly rated.',
    },
  },
  {
    keywords: {
      ar: ['سعر', 'أسعار', 'كم', 'رخاص'],
      en: ['price', 'cost', 'cheap', 'how much'],
    },
    response: {
      ar: 'أرخص الأطباق: "زلابية بالعسل" (6,000 د.ع)، "كليجة بالتمر" (7,000 د.ع)، "هريسة" (8,000 د.ع). تحب أقترح لك شيئاً؟',
      en: 'Cheapest dishes: "Zalabia with Honey" (6,000 IQD), "Kleija with Dates" (7,000 IQD), "Hareesa" (8,000 IQD). Want a suggestion?',
    },
  },
  {
    keywords: {
      ar: ['نباتي', 'خضار', 'بدون لحم'],
      en: ['vegetarian', 'vegan', 'veggie', 'no meat'],
    },
    response: {
      ar: 'خيارات نباتية: "دولمة ورق عنب" (10,000 د.ع) — نباتي ولذيذ! أو "باقلاء" للإفطار.',
      en: 'Vegetarian options: "Stuffed Grape Leaves" (10,000 IQD) — vegetarian & delicious! Or "Baqella" for breakfast.',
    },
  },
  {
    keywords: {
      ar: ['الأفضل', 'نصيحة', 'أحسن'],
      en: ['best', 'top', 'favorite', 'recommendation'],
    },
    response: {
      ar: 'الأفضل تقييماً: 1) زلابية بالعسل (5.0⭐) 2) مسكوف بصري (4.9⭐) 3) برياني أبو كرار (4.9⭐). اختر ما يناسبك!',
      en: 'Top rated: 1) Zalabia with Honey (5.0⭐) 2) Basra Masgouf (4.9⭐) 3) Abu Karar Biryani (4.9⭐). Take your pick!',
    },
  },
];

const DEFAULT_RESPONSE = {
  ar: 'شكراً لسؤالك! يمكنني مساعدتك في اختيار الأطباق، معرفة الأسعار، تتبع الطلبات، واقتراح العروض. جرّب أن تسألني: "اقترح لي طبقاً" أو "أريد شيئاً حاراً".',
  en: 'Thanks for asking! I can help you choose dishes, check prices, track orders, and suggest offers. Try asking: "Suggest a dish" or "I want something spicy".',
};

export default function AIChatAssistant() {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // رسالة الترحيب
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: 'ai',
          text: t(
            'مرحباً بك في نكهة البصرة! 🌴 أنا مساعدك الذكي، جاهز لأساعدك في اختيار أشهى الأطباق البصرية. كيف أقدر أساعدك اليوم؟',
            'Welcome to Basra Flavor! 🌴 I am your smart assistant, ready to help you choose the best Basra dishes. How can I help you today?'
          ),
        },
      ]);
    }
  }, [isOpen, messages.length, t]);

  // التمرير التلقائي
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // الرد الذكي
  const getAIResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    for (const item of MOCK_RESPONSES) {
      const allKeywords = [...item.keywords.ar, ...item.keywords.en];
      if (allKeywords.some((kw) => text.includes(kw.toLowerCase()))) {
        return lang === 'ar' ? item.response.ar : item.response.en;
      }
    }

    return lang === 'ar' ? DEFAULT_RESPONSE.ar : DEFAULT_RESPONSE.en;
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: messageText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // محاكاة تأخير الرد
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: getAIResponse(messageText),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleClear = () => {
    setMessages([]);
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 100);
  };

  return (
    <>
      {/* الزر العائم */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[80] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
          boxShadow: '0 10px 40px rgba(201, 162, 39, 0.5)',
        }}
      >
        <MessageCircle size={28} style={{ color: '#0F2419' }} />
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: '#ef4444', color: '#FFFFFF' }}
        >
          AI
        </motion.span>
      </motion.button>

      {/* نافذة المحادثة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 22, stiffness: 250 }}
            className="fixed bottom-6 left-6 z-[90] w-[calc(100vw-3rem)] max-w-md rounded-3xl overflow-hidden flex flex-col"
            style={{
              height: '600px',
              maxHeight: 'calc(100vh - 3rem)',
              background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 100%)',
              border: '2px solid rgba(201, 162, 39, 0.4)',
              boxShadow: '0 25px 80px rgba(201, 162, 39, 0.3)',
            }}
          >
            {/* الرأس */}
            <div
              className="p-5 flex items-center justify-between"
              style={{
                borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
                background: 'rgba(201, 162, 39, 0.05)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center relative"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
                >
                  <Sparkles size={22} style={{ color: '#0F2419' }} />
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-emerald-deep"
                    style={{ background: '#22c55e' }}
                  />
                </div>
                <div>
                  <h3 className="font-ruqaa text-xl text-gradient-gold">
                    {t('مساعد نكهة البصرة', 'Basra Flavor Assistant')}
                  </h3>
                  <p className="font-tajawal text-[10px]" style={{ color: '#22c55e' }}>
                    ● {t('متصل الآن', 'Online now')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  title={t('محادثة جديدة', 'New chat')}
                >
                  <Trash2 size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={18} style={{ color: '#F5D76E' }} />
                </button>
              </div>
            </div>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'} gap-2`}
                >
                  {msg.role === 'ai' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
                    >
                      <ChefHat size={14} style={{ color: '#0F2419' }} />
                    </div>
                  )}
                  <div
                    className="rounded-2xl px-4 py-3 max-w-[85%]"
                    style={{
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #C9A227, #F5D76E)'
                          : 'rgba(255, 255, 255, 0.08)',
                      color: msg.role === 'user' ? '#0F2419' : '#FFFFFF',
                      border:
                        msg.role === 'ai'
                          ? '1px solid rgba(201, 162, 39, 0.2)'
                          : 'none',
                    }}
                  >
                    <p className="font-tajawal text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* مؤشر الكتابة */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-end"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
                  >
                    <ChefHat size={14} style={{ color: '#0F2419' }} />
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 flex gap-1"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(201, 162, 39, 0.2)',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: '#F5D76E' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* اقتراحات سريعة */}
              {messages.length <= 1 && !isTyping && (
                <div className="pt-4">
                  <p
                    className="font-tajawal text-xs mb-3 text-center"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    {t('جرّب أحد هذه الأسئلة:', 'Try one of these:')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_SUGGESTIONS.map((sug, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => handleSend(lang === 'ar' ? sug.ar : sug.en)}
                        className="p-3 rounded-xl font-tajawal text-xs transition-all hover:scale-105 text-right"
                        style={{
                          background: 'rgba(201, 162, 39, 0.08)',
                          border: '1px solid rgba(201, 162, 39, 0.25)',
                          color: '#FFFFFF',
                        }}
                      >
                        {lang === 'ar' ? sug.ar : sug.en}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* حقل الإدخال */}
            <div
              className="p-4"
              style={{ borderTop: '1px solid rgba(201, 162, 39, 0.2)' }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('اسألني عن أي طبق...', 'Ask me about any dish...')}
                  style={{
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(201, 162, 39, 0.35)',
                    borderRadius: '999px',
                    padding: '12px 18px',
                    width: '100%',
                    fontFamily: 'Tajawal, sans-serif',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
                  }}
                >
                  <Send size={18} style={{ color: '#0F2419' }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}