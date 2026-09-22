import { Utensils, Moon, Sun, Sparkles, Calendar, Trophy, HeartHandshake, Heart } from 'lucide-react';

export default function CustomerSubNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'all', label: 'جميع النكهات 🌴', icon: Utensils },
    { id: 'night', label: 'Basra Night Food 🌙', icon: Moon },
    { id: 'breakfast', label: 'Breakfast in Basra ☀️', icon: Sun },
    { id: 'flavor-match', label: 'Flavor Match 🎯', icon: Sparkles },
    { id: 'custom-group', label: 'طلبات خاصة وجماعية 👥', icon: Utensils },
    { id: 'weekly-plan', label: 'خطة الوجبات الأسبوعية 📅', icon: Calendar },
    { id: 'challenges', label: 'التحديات والأوسمة 🏆', icon: Trophy },
    { id: 'surplus', label: 'إنقاذ الطعام والتبرع 💚', icon: HeartHandshake },
    { id: 'favorites', label: 'المفضلة ⭐', icon: Heart },
  ];

  return (
    <nav className="customer-subnav">
      <div className="subnav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`subnav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
