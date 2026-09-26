import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-20 bg-emerald-deep border-t border-gold/20">
      {/* شريط ذهبي علوي */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A227, #F5D76E, #C9A227, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* الشعار */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center gold-border">
              <span className="font-ruqaa text-3xl text-gradient-gold">ن</span>
            </div>
            <span className="font-ruqaa text-2xl text-gradient-gold">{t('نكهة البصرة', 'Basra Flavor')}</span>
          </div>
          <p className="text-cream/60 font-tajawal text-sm leading-relaxed">
            {t('أصالة الماضي... بعبق الحاضر. أطباق منزلية بصري أصيلة من أيدي طُهاة محترفين.', 'Authenticity of the past with the fragrance of the present. Homemade Basra dishes from expert cooks.')}
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 className="font-ruqaa text-lg text-gold-bright mb-4">{t('روابط سريعة', 'Quick Links')}</h3>
          <ul className="space-y-2">
            {[
              { to: '/', label: t('الرئيسية', 'Home') },
              { to: '/meals', label: t('الأطباق', 'Meals') },
              { to: '/cooks', label: t('الطُهاة', 'Cooks') },
              { to: '/flavor-match', label: 'Flavor Match' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-cream/60 hover:text-gold-bright font-tajawal text-sm transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* خدماتنا */}
        <div>
          <h3 className="font-ruqaa text-lg text-gold-bright mb-4">{t('خدماتنا', 'Our Services')}</h3>
          <ul className="space-y-2 text-cream/60 font-tajawal text-sm">
            <li>{t('توصيل سريع', 'Fast Delivery')}</li>
            <li>{t('طلبات المناسبات', 'Event Catering')}</li>
            <li>{t('اشتراك أسبوعي', 'Weekly Subscription')}</li>
            <li>{t('Flavor Match', 'Flavor Match')}</li>
          </ul>
        </div>

        {/* تواصل */}
        <div>
          <h3 className="font-ruqaa text-lg text-gold-bright mb-4">{t('تواصل معنا', 'Contact Us')}</h3>
          <div className="space-y-3 text-cream/60 font-tajawal text-sm">
            <div className="flex items-center gap-2"><Phone size={16} className="text-gold" /> +964 770 123 4567</div>
            <div className="flex items-center gap-2"><Mail size={16} className="text-gold" /> info@basraflavor.iq</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {t('البصرة، العراق', 'Basra, Iraq')}</div>
          </div>
          <div className="flex gap-3 mt-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full glass-light flex items-center justify-center hover:gold-glow transition-all">
                <Icon size={16} className="text-gold-bright" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* خط فاصل */}
      <div className="border-t border-gold/10 py-4 text-center text-cream/40 font-tajawal text-xs">
        © 2026 {t('نكهة البصرة', 'Basra Flavor')} — {t('جميع الحقوق محفوظة', 'All rights reserved')}
      </div>
    </footer>
  );
}
