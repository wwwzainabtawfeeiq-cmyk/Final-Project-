import React from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Moon, Sun } from 'lucide-react';

export default function TopPortalBar() {
  const { activePortal, setActivePortal } = useCart();
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 5;

  return (
    <div className="top-portal-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isNight ? (
          <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Moon size={14} /> البصرة ليلاً (Basra Night Food نشط)
          </span>
        ) : (
          <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sun size={14} /> إفطار البصرة (Breakfast in Basra)
          </span>
        )}
      </div>

      <div className="portal-tabs">
        <button
          className={`portal-btn ${activePortal === 'customer' ? 'active-customer' : ''}`}
          onClick={() => setActivePortal('customer')}
        >
          <ShoppingBag size={13} style={{ marginLeft: 4 }} /> واجهة الزبون (Customer)
        </button>
      </div>
    </div>
  );
}
