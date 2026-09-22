import { BookOpen, Star, ShoppingCart } from 'lucide-react';
import { MOCK_SECRET_RECIPES } from '../../mockData/data';

export default function SecretRecipeMarket() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 850, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)', color: 'white', padding: '24px', borderRadius: 20, marginBottom: 24, textAlign: 'center' }}>
        <BookOpen size={36} style={{ margin: '0 auto 8px' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>
          متجر الوصفات والبهارات السرية (Secret Recipes 📜)
        </h1>
        <p style={{ fontSize: '0.88rem', opacity: 0.9 }}>
          بيع واشترِ أسرار الخلطات البصرية المعتقة، تتبيلات السمك المسقوف، ونسب البهارات الخاصة من كبار طباخي البصرة.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        {MOCK_SECRET_RECIPES.map(recipe => (
          <div key={recipe.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.78rem', color: '#c2410c', fontWeight: 700, background: '#ffedd5', padding: '3px 8px', borderRadius: 12 }}>
                وصفة محمية
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star size={14} fill="#f59e0b" /> {recipe.rating}
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
              {recipe.title}
            </h3>

            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 12 }}>
              صاحب الوصفة: <strong>{recipe.cookName}</strong> ({recipe.salesCount} مبيعة)
            </div>

            <p style={{ fontSize: '0.84rem', color: '#475569', marginBottom: 16, lineHeight: 1.5 }}>
              {recipe.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#c2410c' }}>
                {recipe.price.toLocaleString()} د.ع
              </span>

              <button
                onClick={() => alert(`شراء الوصفة السرية: ${recipe.title}`)}
                style={{ background: '#c2410c', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <ShoppingCart size={14} /> شراء كشف السر
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
