import React, { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, AlertCircle, Utensils, Users, Calendar } from 'lucide-react';

export default function CookOrdersKanban() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-901",
      customerName: "حسين علي",
      mealTitle: "مطبق زبيدي بصري على أصوله",
      qty: 2,
      totalPrice: 36000,
      type: "standard", // standard | custom | group | scheduled
      status: "pending", // pending | preparing | ready | delivery | completed
      date: "اليوم 1:15 م",
      notes: "يرجى زيادة اللومي الحامض وإضافة حوايج إضافية"
    },
    {
      id: "ORD-902",
      customerName: "فاطمة جاسم (طلب جماعي)",
      mealTitle: "سمك بني مسقوف على الحطب",
      qty: 4,
      totalPrice: 100000,
      type: "group",
      status: "preparing",
      date: "اليوم 12:45 م",
      notes: "طلب مكتب الجبيلة - تسليم دفعة واحدة"
    },
    {
      id: "ORD-903",
      customerName: "د. أحمد الموسوي",
      mealTitle: "مرقة بامية باللحم وتمن أحمر (طلب مجدول)",
      qty: 3,
      totalPrice: 36000,
      type: "scheduled",
      status: "ready",
      date: "غداً 2:00 م",
      notes: "طلب مجدول للأسبوع - تسليم عائلتي"
    }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return { label: 'معلق ⏳', bg: '#fef3c7', color: '#b45309' };
      case 'preparing': return { label: 'قيد التحضير 🍳', bg: '#e0f2fe', color: '#0369a1' };
      case 'ready': return { label: 'جاهز للتسليم 📦', bg: '#f0fdf4', color: '#15803d' };
      case 'completed': return { label: 'مكتمل ✅', bg: '#f1f5f9', color: '#475569' };
      default: return { label: status, bg: '#eee', color: '#333' };
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingBag color="#d97706" size={24} /> لوحة متابعة الطلبات الواردة (Orders Kanban Board)
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {orders.map(order => {
          const badge = getStatusBadge(order.status);
          return (
            <div key={order.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>#{order.id}</span>
                <span style={{ background: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800 }}>
                  {badge.label}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
                {order.mealTitle}
              </h4>

              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: 8 }}>
                الزبون: <strong>{order.customerName}</strong> ({order.qty} وجبات)
              </div>

              {order.notes && (
                <div style={{ background: '#f8fafc', padding: 8, borderRadius: 8, fontSize: '0.8rem', color: '#64748b', marginBottom: 12 }}>
                  💬 {order.notes}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 12, marginBottom: 16 }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{order.date}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#d97706' }}>
                  {order.totalPrice.toLocaleString()} د.ع
                </span>
              </div>

              {/* Status Change Action Buttons */}
              <div style={{ display: 'flex', gap: 6 }}>
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    style={{ flex: 1, background: '#0284c7', color: 'white', border: 'none', padding: 8, borderRadius: 8, fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    بدء التحضير 🍳
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    style={{ flex: 1, background: '#16a34a', color: 'white', border: 'none', padding: 8, borderRadius: 8, fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    جاهز للتسليم 📦
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    style={{ flex: 1, background: '#475569', color: 'white', border: 'none', padding: 8, borderRadius: 8, fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    تم التسليم بنجاح ✅
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
