import { useCart } from '../../context/CartContext';
import { ChefHat, ShoppingBag, ShieldCheck, Moon, Sun } from 'lucide-react';

export default function TopPortalBar() {
  const { activePortal, setActivePortal } = useCart();
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 5;

  return (
    <div className="top-portal-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isNight ? (
          <span style={{ color: '#e9c46a', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
            <Moon size={14} color="#e9c46a" /> البصرة ليلاً 🌙 (Basra Night Food نشط)
          </span>
        ) : (
          <span style={{ color: '#e9c46a', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
            <Sun size={14} color="#e9c46a" /> إفطار البصرة ☀️ (Breakfast in Basra نشط)
          </span>
        )}
      </div>

      <div className="portal-tabs">
        <button
          className={`portal-btn ${activePortal === 'customer' ? 'active-customer' : ''}`}
          onClick={() => setActivePortal('customer')}
        >
          <ShoppingBag size={13} style={{ marginLeft: 4 }} /> واجهة الزبون
        </button>
        <button
          className={`portal-btn ${activePortal === 'cook' ? 'active-cook' : ''}`}
          onClick={() => setActivePortal('cook')}
        >
          <ChefHat size={13} style={{ marginLeft: 4 }} /> واجهة الطباخ
        </button>
        <button
          className={`portal-btn ${activePortal === 'admin' ? 'active-admin' : ''}`}
          onClick={() => setActivePortal('admin')}
        >
          <ShieldCheck size={13} style={{ marginLeft: 4 }} /> واجهة الأدمن
        </button>
      </div>
    </div>
  );
}
