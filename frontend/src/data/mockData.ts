// بيانات تجريبية - أطباق بصري أصيلة مع صور حقيقية

export interface Meal {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  image: string;
  category: string;
  cookId: number;
  rating: number;
  prepTime: string;
  tags: string[];
  spicy?: boolean;
  sweet?: boolean;
}

export interface Cook {
  id: number;
  name: string;
  nameEn: string;
  specialty: string;
  specialtyEn: string;
  image: string;
  rating: number;
  orders: number;
  bio: string;
  bioEn: string;
  topRated?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'الكل', nameEn: 'All', icon: 'UtensilsCrossed' },
  { id: 'main', name: 'أطباق رئيسية', nameEn: 'Main Dishes', icon: 'ChefHat' },
  { id: 'grill', name: 'مشاوي', nameEn: 'Grills', icon: 'Flame' },
  { id: 'rice', name: 'أرز وبرياني', nameEn: 'Rice & Biryani', icon: 'CookingPot' },
  { id: 'appetizer', name: 'مقبلات', nameEn: 'Appetizers', icon: 'Salad' },
  { id: 'dessert', name: 'حلويات', nameEn: 'Desserts', icon: 'Cake' },
  { id: 'bread', name: 'خبز', nameEn: 'Bread', icon: 'Wheat' },
  { id: 'soup', name: 'شوربات', nameEn: 'Soups', icon: 'Soup' },
];

export const cooks: Cook[] = [
  {
    id: 1,
    name: 'أم أحمد',
    nameEn: 'Um Ahmed',
    specialty: 'مسكوف وتشريب',
    specialtyEn: 'Masgouf & Tashreeb',
    image: 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.9,
    orders: 1240,
    bio: 'خبرة 30 عاماً في المطبخ البصري الأصيل',
    bioEn: '30 years of authentic Basra cuisine',
    topRated: true,
  },
  {
    id: 2,
    name: 'أبو حسين',
    nameEn: 'Abu Hussein',
    specialty: 'مشاوي وكباب',
    specialtyEn: 'Grills & Kebabs',
    image: 'https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.8,
    orders: 980,
    bio: 'ملك المشاوي على الفحم',
    bioEn: 'King of charcoal grills',
    topRated: true,
  },
  {
    id: 3,
    name: 'ست نورية',
    nameEn: 'Set Nouria',
    specialty: 'حلويات وزلابية',
    specialtyEn: 'Desserts & Zalabia',
    image: 'https://images.pexels.com/photos/3770002/pexels-photo-3770002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 5.0,
    orders: 1530,
    bio: 'حلويات بصري بوصفات الجدات',
    bioEn: 'Basra sweets with grandmother recipes',
    topRated: true,
  },
  {
    id: 4,
    name: 'أبو علي',
    nameEn: 'Abu Ali',
    specialty: 'قوزي ودولمة',
    specialtyEn: 'Quzi & Dolma',
    image: 'https://images.pexels.com/photos/24252237/pexels-photo-24252237.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.7,
    orders: 760,
    bio: 'أطباق مناسبات لا تُنسى',
    bioEn: 'Unforgettable event dishes',
  },
  {
    id: 5,
    name: 'أم سيف',
    nameEn: 'Um Saif',
    specialty: 'هريسة وباقلاء',
    specialtyEn: 'Hareesa & Broad Beans',
    image: 'https://images.pexels.com/photos/3769739/pexels-photo-3769739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.6,
    orders: 540,
    bio: 'إفطار بصري أصيل كل صباح',
    bioEn: 'Authentic Basra breakfast every morning',
  },
  {
    id: 6,
    name: 'أبو كرار',
    nameEn: 'Abu Karar',
    specialty: 'برياني وتمّن',
    specialtyEn: 'Biryani & Rice',
    image: 'https://images.pexels.com/photos/8629075/pexels-photo-8629075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    rating: 4.8,
    orders: 1120,
    bio: 'برياني ببهارات خاصة',
    bioEn: 'Biryani with special spices',
    topRated: true,
  },
];

export const meals: Meal[] = [
  {
    id: 1,
    name: 'مسكوف بصري',
    nameEn: 'Basra Masgouf',
    description: 'سمك الشبوط المشوي على الجمر مع بهارات شط العربية الأصيلة',
    descriptionEn: 'Grilled carp over embers with authentic Shatt al-Arab spices',
    price: 18000,
    image: 'https://images.pexels.com/photos/36796430/pexels-photo-36796430.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'grill',
    cookId: 1,
    rating: 4.9,
    prepTime: '45 دقيقة',
    tags: ['سمك', 'مشوي', 'بهارات'],
  },
  {
    id: 2,
    name: 'قوزي بغدادي',
    nameEn: 'Quzi Baghdadi',
    description: 'لحم الخروف المطبوء على الأرز البسمتي مع المكسرات والزبيب',
    descriptionEn: 'Slow-cooked lamb over basmati rice with nuts and raisins',
    price: 22000,
    image: 'https://images.pexels.com/photos/5639251/pexels-photo-5639251.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'main',
    cookId: 4,
    rating: 4.8,
    prepTime: '90 دقيقة',
    tags: ['لحم', 'أرز', 'مناسبات'],
  },
  {
    id: 3,
    name: 'برياني أبو كرار',
    nameEn: 'Abu Karar Biryani',
    description: 'برياني ببهارات سرية مع لحم ودجاج وأرز معطر',
    descriptionEn: 'Biryani with secret spices, meat, chicken and fragrant rice',
    price: 15000,
    image: 'https://images.pexels.com/photos/32986475/pexels-photo-32986475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'rice',
    cookId: 6,
    rating: 4.9,
    prepTime: '60 دقيقة',
    tags: ['برياني', 'بهارات', 'حار'],
    spicy: true,
  },
  {
    id: 4,
    name: 'كباب بصري',
    nameEn: 'Basra Kebab',
    description: 'كباب لحم العجل المشوي على الفحم مع الخضار المشوية',
    descriptionEn: 'Grilled veal kebab over charcoal with grilled vegetables',
    price: 14000,
    image: 'https://images.pexels.com/photos/32986489/pexels-photo-32986489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'grill',
    cookId: 2,
    rating: 4.7,
    prepTime: '30 دقيقة',
    tags: ['لحم', 'مشوي', 'فحم'],
  },
  {
    id: 5,
    name: 'دولمة ورق عنب',
    nameEn: 'Stuffed Grape Leaves',
    description: 'ورق عنب محشي بالرز والخضار مع لمسة ليمون',
    descriptionEn: 'Grape leaves stuffed with rice and vegetables with a lemon touch',
    price: 10000,
    image: 'https://images.pexels.com/photos/8197794/pexels-photo-8197794.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'appetizer',
    cookId: 4,
    rating: 4.6,
    prepTime: '50 دقيقة',
    tags: ['ورق عنب', 'نباتي'],
  },
  {
    id: 6,
    name: 'هريسة بصري',
    nameEn: 'Basra Hareesa',
    description: 'هريسة القمح واللحم التقليدية على الطريقة البصرية',
    descriptionEn: 'Traditional wheat and meat hareesa Basra-style',
    price: 8000,
    image: 'https://images.pexels.com/photos/11369845/pexels-photo-11369845.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'main',
    cookId: 5,
    rating: 4.5,
    prepTime: '70 دقيقة',
    tags: ['قمح', 'لحم', 'تقليدي'],
  },
  {
    id: 7,
    name: 'زلابية بالعسل',
    nameEn: 'Zalabia with Honey',
    description: 'زلابية ذهبية مقرمشة مغموسة بالعسل الصافي',
    descriptionEn: 'Crispy golden zalabia drenched in pure honey',
    price: 6000,
    image: 'https://images.pexels.com/photos/31786489/pexels-photo-31786489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'dessert',
    cookId: 3,
    rating: 5.0,
    prepTime: '20 دقيقة',
    tags: ['حلو', 'عسل', 'مقرمش'],
    sweet: true,
  },
  {
    id: 8,
    name: 'كليجة بالتمر',
    nameEn: 'Kleija with Dates',
    description: 'كليجة محشوة بعجينة التمر مع الهيل والهيل',
    descriptionEn: 'Date-filled kleija with cardamom',
    price: 7000,
    image: 'https://images.pexels.com/photos/10865939/pexels-photo-10865939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'dessert',
    cookId: 3,
    rating: 4.8,
    prepTime: '40 دقيقة',
    tags: ['تمر', 'حلو', 'شاي'],
    sweet: true,
  },
  {
    id: 9,
    name: 'تشريب بصري',
    nameEn: 'Basra Tashreeb',
    description: 'خبز مغمور بمرق اللحم والخضار على الطريقة البصرية',
    descriptionEn: 'Bread soaked in lamb broth with vegetables, Basra-style',
    price: 12000,
    image: 'https://images.pexels.com/photos/38301350/pexels-photo-38301350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'main',
    cookId: 1,
    rating: 4.7,
    prepTime: '55 دقيقة',
    tags: ['لحم', 'خبز', 'مرق'],
  },
  {
    id: 10,
    name: 'تمّن بصري',
    nameEn: 'Basra Rice',
    description: 'أرز بسمتي أصفر مع دجاج وبهارات معطرة',
    descriptionEn: 'Yellow basmati rice with chicken and fragrant spices',
    price: 13000,
    image: 'https://images.pexels.com/photos/36934941/pexels-photo-36934941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'rice',
    cookId: 6,
    rating: 4.6,
    prepTime: '45 دقيقة',
    tags: ['دجاج', 'أرز'],
  },
  {
    id: 11,
    name: 'مقلوبة باذنجان',
    nameEn: 'Eggplant Maqluba',
    description: 'مقلوبة الأرز بالباذنجان واللحم مقلوبة عند التقديم',
    descriptionEn: 'Upside-down rice with eggplant and lamb',
    price: 16000,
    image: 'https://images.pexels.com/photos/14731625/pexels-photo-14731625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'main',
    cookId: 4,
    rating: 4.8,
    prepTime: '80 دقيقة',
    tags: ['باذنجان', 'لحم', 'أرز'],
  },
  {
    id: 12,
    name: 'باكلوا بالفستق',
    nameEn: 'Pistachio Baklava',
    description: 'طبقات رقيقة محشوة بالفستق الحلبي مع شراب السكر',
    descriptionEn: 'Thin layers stuffed with Aleppo pistachio and sugar syrup',
    price: 9000,
    image: 'https://images.pexels.com/photos/17688137/pexels-photo-17688137.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'dessert',
    cookId: 3,
    rating: 4.9,
    prepTime: '60 دقيقة',
    tags: ['فستق', 'حلو', 'مقرمش'],
    sweet: true,
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'كرار الموسوي',
    nameEn: 'Karar Al-Mousawi',
    text: 'أفضل مسكوف تذوقته منذ زمن! الطبق وصل ساخناً وطازجاً كأنه من بيت أمي.',
    textEn: 'Best masgouf I have tasted in years! Arrived hot and fresh as if from my mother\'s kitchen.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/4253298/pexels-photo-4253298.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
  },
  {
    id: 2,
    name: 'زينب عبد الله',
    nameEn: 'Zainab Abdullah',
    text: 'الزلابية كانت خيالية! ابني طلب وصفة ست نورية لأني ما أعرف أسويها مثله.',
    textEn: 'The zalabia was heavenly! My son asked for Set Nouria\'s recipe because I can\'t make it like hers.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/3770002/pexels-photo-3770002.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
  },
  {
    id: 3,
    name: 'حسين الكعبي',
    nameEn: 'Hussein Al-Kaabi',
    text: 'برياني أبو كرار أصبح وجبتي المفضلة كل جمعة. التوصيل سريع والطعم لا يُضاهى.',
    textEn: 'Abu Karar\'s biryani became my favorite meal every Friday. Fast delivery and unmatched taste.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/24252237/pexels-photo-24252237.jpeg?auto=compress&cs=tinysrgb&h=150&w=150',
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ar-IQ').format(price) + ' د.ع';
};
