import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, MapPin, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export interface PreOrderData {
  isScheduled: boolean;
  scheduledDate?: string;
  scheduledTime?: string;
  isForOther: boolean;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  message?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PreOrderData) => void;
  initialData?: PreOrderData;
}

const INPUT_STYLE: React.CSSProperties = {
  color: '#FFFFFF',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(201, 162, 39, 0.35)',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  fontFamily: 'Tajawal, sans-serif',
  fontSize: '16px',
  outline: 'none',
  transition: 'all 0.2s ease',
  colorScheme: 'dark',
};

export default function PreOrderModal({ isOpen, onClose, onSave, initialData }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState<PreOrderData>(
    initialData || {
      isScheduled: false,
      isForOther: false,
    }
  );

  const set = <K extends keyof PreOrderData>(k: K, v: PreOrderData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (form.isScheduled && (!form.scheduledDate || !form.scheduledTime)) {
      toast.error(t('يرجى تحديد التاريخ والوقت', 'Please select date and time'));
      return;
    }
    if (form.isForOther) {
      if (!form.recipientName || !form.recipientPhone || !form.recipientAddress) {
        toast.error(t('يرجى ملء معلومات المستلم', 'Please fill recipient details'));
        return;
      }
    }
    onSave(form);
    toast.success(t('تم حفظ إعدادات الطلب', 'Order settings saved'));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 250 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden my-8"
            style={{
              background: 'linear-gradient(135deg, #0F2419 0%, #1B4332 100%)',
              border: '2px solid rgba(201, 162, 39, 0.4)',
              boxShadow: '0 25px 80px rgba(201, 162, 39, 0.3)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <X size={18} style={{ color: '#F5D76E' }} />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
                  style={{ background: 'linear-gradient(135deg, #C9A227, #F5D76E)' }}
                >
                  <Calendar size={26} style={{ color: '#0F2419' }} />
                </div>
                <h2 className="font-ruqaa text-3xl text-gradient-gold mb-1">
                  {t('خيارات الطلب', 'Order Options')}
                </h2>
                <p className="font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {t('جدولة الطلب أو إرساله لشخص آخر', 'Schedule or send to someone else')}
                </p>
              </div>

              <div className="space-y-5">
                {/* جدولة الطلب */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    border: '1px solid rgba(201, 162, 39, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <label className="flex items-center justify-between cursor-pointer mb-3">
                    <span className="flex items-center gap-2 font-tajawal text-base" style={{ color: '#FFFFFF' }}>
                      <Calendar size={18} style={{ color: '#F5D76E' }} />
                      {t('جدولة الطلب', 'Schedule Order')}
                    </span>
                    <button
                      type="button"
                      onClick={() => set('isScheduled', !form.isScheduled)}
                      className="w-12 h-7 rounded-full transition-colors relative"
                      style={{
                        backgroundColor: form.isScheduled ? '#C9A227' : 'rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <span
                        className="absolute top-1 h-5 w-5 rounded-full transition-all"
                        style={{
                          backgroundColor: '#0F2419',
                          right: form.isScheduled ? '4px' : 'calc(100% - 24px)',
                        }}
                      />
                    </button>
                  </label>

                  {form.isScheduled && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input
                        type="date"
                        value={form.scheduledDate || ''}
                        onChange={(e) => set('scheduledDate', e.target.value)}
                        style={INPUT_STYLE}
                      />
                      <input
                        type="time"
                        value={form.scheduledTime || ''}
                        onChange={(e) => set('scheduledTime', e.target.value)}
                        style={INPUT_STYLE}
                      />
                    </div>
                  )}
                </div>

                {/* الطلب لشخص آخر */}
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    border: '1px solid rgba(201, 162, 39, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <label className="flex items-center justify-between cursor-pointer mb-3">
                    <span className="flex items-center gap-2 font-tajawal text-base" style={{ color: '#FFFFFF' }}>
                      <User size={18} style={{ color: '#F5D76E' }} />
                      {t('اطلب لشخص آخر', 'Order for Someone Else')}
                    </span>
                    <button
                      type="button"
                      onClick={() => set('isForOther', !form.isForOther)}
                      className="w-12 h-7 rounded-full transition-colors relative"
                      style={{
                        backgroundColor: form.isForOther ? '#C9A227' : 'rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <span
                        className="absolute top-1 h-5 w-5 rounded-full transition-all"
                        style={{
                          backgroundColor: '#0F2419',
                          right: form.isForOther ? '4px' : 'calc(100% - 24px)',
                        }}
                      />
                    </button>
                  </label>

                  {form.isForOther && (
                    <div className="space-y-3 mt-4">
                      <div className="relative">
                        <User size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: '#C9A227' }} />
                        <input
                          type="text"
                          value={form.recipientName || ''}
                          onChange={(e) => set('recipientName', e.target.value)}
                          placeholder={t('اسم المستلم', 'Recipient name')}
                          style={{ ...INPUT_STYLE, paddingRight: '40px' }}
                        />
                      </div>
                      <div className="relative">
                        <Phone size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: '#C9A227' }} />
                        <input
                          type="tel"
                          value={form.recipientPhone || ''}
                          onChange={(e) => set('recipientPhone', e.target.value)}
                          placeholder={t('رقم هاتف المستلم', 'Recipient phone')}
                          style={{ ...INPUT_STYLE, paddingRight: '40px' }}
                        />
                      </div>
                      <div className="relative">
                        <MapPin size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: '#C9A227' }} />
                        <input
                          type="text"
                          value={form.recipientAddress || ''}
                          onChange={(e) => set('recipientAddress', e.target.value)}
                          placeholder={t('عنوان المستلم', 'Recipient address')}
                          style={{ ...INPUT_STYLE, paddingRight: '40px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* رسالة */}
                <div>
                  <label className="flex items-center gap-2 mb-2 font-tajawal text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    <MessageSquare size={16} style={{ color: '#F5D76E' }} />
                    {t('رسالة مع الطلب (اختياري)', 'Message with order (optional)')}
                  </label>
                  <textarea
                    rows={2}
                    value={form.message || ''}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder={t('مثال: عيد ميلاد سعيد!', 'e.g., Happy Birthday!')}
                    style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: '70px' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-full font-tajawal font-bold transition-all"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3.5 rounded-full font-tajawal font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #C9A227, #F5D76E)',
                    color: '#0F2419',
                  }}
                >
                  {t('حفظ', 'Save')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}