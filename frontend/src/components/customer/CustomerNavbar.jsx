import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Search, MapPin, ShoppingBag, Mic, Sparkles, Heart } from 'lucide-react';
import VoiceOrderModal from './VoiceOrderModal';

export default function CustomerNavbar({ searchTerm, setSearchTerm, onOpenCart, onOpenFlavorMatch }) {
  const { cartCount, favorites } = useCart();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <>
      <header className="customer-navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="brand-logo">
            🍲 نكهة <span>البصرة</span>
          </div>

          {/* Location Picker */}
          <div className="location-picker">
            <MapPin size={16} color="#d97706" />
            <span>البصرة، الجزائر</span>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="ابحث عن مسقوف، مطبق، قيمر سدة، أو اسم الطباخ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            {/* Flavor Match Button */}
            <button className="nav-btn nav-btn-accent" onClick={onOpenFlavorMatch}>
              <Sparkles size={16} /> Flavor Match
            </button>

            {/* Voice-First Order Button */}
            <button className="nav-btn" onClick={() => setIsVoiceModalOpen(true)}>
              <Mic size={16} color="#d97706" /> طلب صوتي
            </button>

            {/* Favorites Count */}
            <button className="nav-btn" style={{ position: 'relative' }}>
              <Heart size={16} color="#e11d48" />
              {favorites.length > 0 && (
                <span style={{
                  background: '#e11d48',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  marginRight: '2px'
                }}>{favorites.length}</span>
              )}
            </button>

            {/* Cart Button */}
            <button className="nav-btn nav-btn-primary cart-btn" onClick={onOpenCart}>
              <ShoppingBag size={18} />
              <span>السلة</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Voice Order Modal */}
      {isVoiceModalOpen && (
        <VoiceOrderModal onClose={() => setIsVoiceModalOpen(false)} />
      )}
    </>
  );
}
