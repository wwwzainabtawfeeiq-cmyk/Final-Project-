import { useCart } from '../../context/CartContext';
import { Heart, Star, Clock, PlusCircle, Check } from 'lucide-react';

export default function MealCard({ meal }) {
  const { addToCart, favorites, toggleFavorite, cartItems } = useCart();
  const isFav = favorites.includes(meal.id);
  const inCart = cartItems.find(item => item.id === meal.id);

  return (
    <div className="meal-card animate-fade-in">
      <div className="meal-card-img-wrapper">
        <img src={meal.image} alt={meal.title} className="meal-card-img" />

        <button
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={() => toggleFavorite(meal.id)}
          title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart size={18} fill={isFav ? '#e11d48' : 'none'} />
        </button>

        {meal.isSurplus && (
          <span className="meal-badge meal-badge-surplus">
            💚 إنقاذ الطعام 50%
          </span>
        )}
        {meal.isNightFood && !meal.isSurplus && (
          <span className="meal-badge meal-badge-night">
            🌙 Basra Night Food
          </span>
        )}
        {meal.isBreakfast && !meal.isSurplus && (
          <span className="meal-badge meal-badge-breakfast">
            ☀️ إفطار البصرة
          </span>
        )}
      </div>

      <div className="meal-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: 600 }}>{meal.category}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>
            <Star size={14} fill="#f59e0b" /> {meal.rating}
          </span>
        </div>

        <h3 className="meal-card-title">{meal.title}</h3>

        <div className="meal-cook-info">
          <span>بواسطة: <strong>{meal.cookName}</strong></span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} /> {meal.prepTime}
          </span>
        </div>

        <p className="meal-card-desc">{meal.description}</p>

        <div className="meal-card-footer">
          <div>
            <span className="meal-price">{meal.price.toLocaleString()} د.ع</span>
            {meal.originalPrice && (
              <span className="meal-original-price">{meal.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            className="add-cart-btn"
            onClick={() => addToCart(meal)}
          >
            {inCart ? (
              <>
                <Check size={16} /> تمت الإضافة ({inCart.quantity})
              </>
            ) : (
              <>
                <PlusCircle size={16} /> أضف للسلة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
