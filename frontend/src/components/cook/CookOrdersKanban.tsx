import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChefHat,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  GripVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

type OrderStatus = 'new' | 'cooking' | 'ready' | 'delivered';

interface KanbanOrder {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
  address: string;
}

const INITIAL_ORDERS: KanbanOrder[] = [
  { id: 'ORD-1024', customer: 'أحمد كريم', items: ['مسكوف × 2'], total: 36000, status: 'new', time: 'منذ 5 د', address: 'العشار' },
  { id: 'ORD-1025', customer: 'علي حسين', items: ['كباب × 1', 'زلابية × 2'], total: 26000, status: 'new', time: 'منذ 8 د', address: 'الجبيلة' },
  { id: 'ORD-1023', customer: 'زينب علي', items: ['زلابية × 1'], total: 20000, status: 'cooking', time: 'منذ 15 د', address: 'الزبير' },
  { id: 'ORD-1026', customer: 'محمد جواد', items: ['برياني × 3'], total: 45000, status: 'cooking', time: 'منذ 20 د', address: 'البراضعية' },
  { id: 'ORD-1022', customer: 'حسين محمد', items: ['قوزي × 1'], total: 22000, status: 'ready', time: 'منذ 25 د', address: 'خمسة ميل' },
  { id: 'ORD-1021', customer: 'فاطمة سالم', items: ['تشريب × 2'], total: 24000, status: 'delivered', time: 'منذ 40 د', address: 'الجزائر' },
];

const COLUMNS: {
  key: OrderStatus;
  ar: string;
  en: string;
  color: string;
  icon: LucideIcon;
}[] = [
  { key: 'new', ar: 'جديدة', en: 'New', color: '#F5D76E', icon: Package },
  { key: 'cooking', ar: 'قيد التحضير', en: 'Cooking', color: '#3b82f6', icon: ChefHat },
  { key: 'ready', ar: 'جاهزة', en: 'Ready', color: '#22c55e', icon: CheckCircle },
  { key: 'delivered', ar: 'مُسلّمة', en: 'Delivered', color: '#a855f7', icon: Truck },
];

export default function CookOrdersKanban() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<KanbanOrder[]>(INITIAL_ORDERS);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: OrderStatus) => {
    e.preventDefault();
    if (!draggedId) return;

    const order = orders.find((o) => o.id === draggedId);
    if (!order) return;

    if (order.status === newStatus) {
      setDraggedId(null);
      setDragOverColumn(null);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === draggedId ? { ...o, status: newStatus } : o))
    );

    const statusLabel = COLUMNS.find((c) => c.key === newStatus);
    toast.success(
      t(
        `تم نقل الطلب إلى "${statusLabel?.ar}"`,
        `Order moved to "${statusLabel?.en}"`
      )
    );

    setDraggedId(null);
    setDragOverColumn(null);
  };

  const getOrdersByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status);

  return (
    <div>
      <h2 className="font-ruqaa text-2xl text-gradient-gold mb-6 flex items-center gap-2">
        <Package size={24} /> {t('لوحة الطلبات (Kanban)', 'Orders Kanban Board')}
      </h2>

      {/* الأعمدة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const columnOrders = getOrdersByStatus(col.key);
          const isOver = dragOverColumn === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className="rounded-2xl p-4 min-h-[400px] transition-all"
              style={{
                background: isOver
                  ? `${col.color}15`
                  : 'linear-gradient(135deg, rgba(15, 36, 25, 0.6), rgba(27, 67, 50, 0.4))',
                border: isOver
                  ? `2px dashed ${col.color}`
                  : '1px solid rgba(201, 162, 39, 0.15)',
              }}
            >
              {/* رأس العمود */}
              <div
                className="flex items-center justify-between mb-4 pb-3"
                style={{ borderBottom: `2px solid ${col.color}40` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${col.color}25` }}
                  >
                    <Icon size={16} style={{ color: col.color }} />
                  </div>
                  <span
                    className="font-tajawal font-bold text-sm"
                    style={{ color: col.color }}
                  >
                    {lang === 'ar' ? col.ar : col.en}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-cairo font-bold"
                  style={{
                    background: `${col.color}20`,
                    color: col.color,
                  }}
                >
                  {columnOrders.length}
                </span>
              </div>

              {/* بطاقات الطلبات */}
              <div className="space-y-3">
                <AnimatePresence>
                  {columnOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={() => handleDragStart(order.id)}
                      className="rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(15, 36, 25, 0.95), rgba(27, 67, 50, 0.7))',
                        border: '1px solid rgba(201, 162, 39, 0.3)',
                        boxShadow:
                          draggedId === order.id
                            ? '0 10px 30px rgba(201, 162, 39, 0.4)'
                            : '0 4px 12px rgba(0, 0, 0, 0.3)',
                        opacity: draggedId === order.id ? 0.5 : 1,
                      }}
                    >
                      {/* رأس البطاقة */}
                      <div className="flex items-start justify-between mb-2">
                        <p
                          className="font-cairo text-sm font-bold"
                          style={{ color: '#F5D76E' }}
                        >
                          {order.id}
                        </p>
                        <GripVertical
                          size={14}
                          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                        />
                      </div>

                      {/* العميل */}
                      <p
                        className="font-tajawal text-xs mb-2"
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        👤 {order.customer}
                      </p>

                      {/* الأطباق */}
                      <div className="space-y-0.5 mb-2">
                        {order.items.map((item, i) => (
                          <p
                            key={i}
                            className="font-tajawal text-[11px]"
                            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                          >
                            • {item}
                          </p>
                        ))}
                      </div>

                      {/* العنوان */}
                      <p
                        className="font-tajawal text-[10px] mb-2 flex items-center gap-1"
                        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        <MapPin size={10} /> {order.address}
                      </p>

                      {/* الفوتر */}
                      <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                        <span
                          className="font-tajawal text-[10px] flex items-center gap-1"
                          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          <Clock size={10} /> {order.time}
                        </span>
                        <span className="font-cairo text-xs text-gradient-gold">
                          {order.total.toLocaleString()} د.ع
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* عمود فارغ */}
                {columnOrders.length === 0 && (
                  <div
                    className="text-center py-8 font-tajawal text-xs rounded-xl"
                    style={{
                      color: 'rgba(255, 255, 255, 0.3)',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {t('اسحب طلباً هنا', 'Drop an order here')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="text-center mt-6 font-tajawal text-xs"
        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
      >
        💡 {t('اسحب البطاقات بين الأعمدة لتغيير حالة الطلب', 'Drag cards between columns to change order status')}
      </p>
    </div>
  );
}