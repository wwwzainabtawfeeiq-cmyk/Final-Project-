import { NavLink, Link } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  ChefHat,
  Sparkles,
  Package,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { cn } from "../../utils/cn";

// يستخدم فقط عندما تكون اللغة الحالية إنجليزية (icon-only nav حسب الميزة 12)
const ITEMS = [
  { to: "/", icon: Home, ar: "الرئيسية", en: "Home" },
  { to: "/meals", icon: UtensilsCrossed, ar: "الأطباق", en: "Meals" },
  { to: "/cooks", icon: ChefHat, ar: "الطُهاة", en: "Cooks" },
  {
    to: "/flavor-match",
    icon: Sparkles,
    ar: "Flavor Match",
    en: "Flavor Match",
  },
  { to: "/orders", icon: Package, ar: "طلباتي", en: "Orders" },
  { to: "/favorites", icon: Heart, ar: "المفضلة", en: "Favorites" },
];

export default function NavbarIcons() {
  const { t } = useLanguage();
  const { count, openCart } = useCart();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {ITEMS.map(({ to, icon: Icon, ar, en }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "group relative h-10 w-10 rounded-full grid place-items-center transition-colors",
              isActive
                ? "text-gold bg-gold/10"
                : "text-cream/60 hover:text-gold hover:bg-gold/5",
            )
          }
        >
          <Icon size={18} />
          <span className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-lg bg-black-deep border border-gold/20 px-2 py-1 text-[11px] text-cream opacity-0 group-hover:opacity-100 transition-opacity">
            {t(ar, en)}
          </span>
        </NavLink>
      ))}
      <button
        onClick={openCart}
        className="group relative h-10 w-10 rounded-full grid place-items-center text-cream/60 hover:text-gold hover:bg-gold/5 transition-colors"
      >
        <ShoppingBag size={18} />
        {count > 0 && (
          <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-gold text-[10px] text-black-deep grid place-items-center font-bold">
            {count}
          </span>
        )}
        <span className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-lg bg-black-deep border border-gold/20 px-2 py-1 text-[11px] text-cream opacity-0 group-hover:opacity-100 transition-opacity">
          {t("السلة", "cart")}
        </span>
      </button>
      <Link
        to="/profile"
        className="group relative h-10 w-10 rounded-full grid place-items-center text-cream/60 hover:text-gold hover:bg-gold/5 transition-colors"
      >
        <User size={18} />
        <span className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-lg bg-black-deep border border-gold/20 px-2 py-1 text-[11px] text-cream opacity-0 group-hover:opacity-100 transition-opacity">
          {t("حسابي", "profile")}
        </span>
      </Link>
    </nav>
  );
}
