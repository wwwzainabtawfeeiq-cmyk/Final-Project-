import { useState } from 'react';
import { X } from 'lucide-react';
import { MOCK_MEALS } from '../../mockData/data';

export default function AddEditMealModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('مأكولات بحرية');
  const [price, setPrice] = useState(15000);
  const [prepTime, setPrepTime] = useState('45 دقيقة');
  const [stock, setStock] = useState(10);
  const [desc, setDesc] = useState('');
  const [isSurplus, setIsSurplus] = useState(false);
  const [isNightFood, setIsNightFood] = useState(false);
  const [isBreakfast, setIsBreakfast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMeal = {
      id: `m${MOCK_MEALS.length + 1}`,
      title,
      cookId: "c1",
      cookName: "أم أحمد البصرية",
      price: Number(price),
      category,
      rating: 5.0,
      prepTime,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      description: desc,
      isNightFood,
      isBreakfast,
      isSurplus,
      tasteProfile: { spicy: 2, sour: 3, traditional: 5, budgetLevel: "medium" },
      availableStock: stock
    };
    MOCK_MEALS.unshift(newMeal);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 550 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
            إضافة وجبة جديدة للمطبخ 🍲
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>اسم الوجبة:</label>
            <input
              type="text"
              placeholder="مثال: مطبق بني بصري، مسقوف على الحطب..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>التصنيف:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1' }}
              >
                <option value="مأكولات بحرية">مأكولات بحرية</option>
                <option value="أطباق رئيسية">أطباق رئيسية</option>
                <option value="إفطار بصري">إفطار بصري</option>
                <option value="أكلات ليلية">أكلات ليلية</option>
                <option value="مسقوف وبحري">مسقوف وبحري</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>السعر (د.ع):</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>وقت التحضير المتوقع:</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الكمية المتاحة اليوم:</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 4 }}>الوصف والمكونات:</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="وصف تفصيلي للوجبة والنكهة والمقبلات..."
              style={{ width: '100%', padding: 9, borderRadius: 8, border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={isNightFood} onChange={(e) => setIsNightFood(e.target.checked)} />
              🌙 Basra Night Food
            </label>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={isBreakfast} onChange={(e) => setIsBreakfast(e.target.checked)} />
              ☀️ إفطار البصرة
            </label>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={isSurplus} onChange={(e) => setIsSurplus(e.target.checked)} />
              💚 وجبة فائضة (خصم 50%)
            </label>
          </div>

          <button
            type="submit"
            style={{ width: '100%', background: '#d97706', color: 'white', padding: 12, borderRadius: 10, fontSize: '0.95rem', fontWeight: 800, border: 'none' }}
          >
            نشر الوجبة في القائمة
          </button>
        </form>
      </div>
    </div>
  );
}
