// mockData/data.js - بيانات الوجبات البصرية مع صور حقيقية عالية الجودة وأيقونات الثيم الأصيل

export const MOCK_COOKS = [];

export const MOCK_MEALS = [
  {
    id: "m1",
    title: "مطبق زبيدي بصري بالحوايج واللومي 🐟",
    cookId: "",
    cookName: "مطبخ بصري تراثي",
    price: 18000,
    category: "مأكولات بحرية",
    rating: 4.9,
    prepTime: "45-60 دقيقة",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
    description: "سمك زبيدي بصري طازج من شط العرب، مطبوخ مع تمن حشو وحوايج بصرية حامضة مع شوربة الرأس.",
    isNightFood: false,
    isBreakfast: false,
    isSurplus: false,
    tasteProfile: { spicy: 2, sour: 5, traditional: 5, budgetLevel: "high" },
    availableStock: 8
  },
  {
    id: "m2",
    title: "سمك بني مسقوف على حطب الغرب 🪵",
    cookId: "",
    cookName: "مطبخ بصري تراثي",
    price: 25000,
    category: "مسقوف وبحري",
    rating: 5.0,
    prepTime: "50-70 دقيقة",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    description: "سمكة بني طازجة مسقوفة بنار حطب الغرب والتتبيلة البصرية السرية مع صلصة الطماطم الحارة والخبز البصري.",
    isNightFood: true,
    isBreakfast: false,
    isSurplus: false,
    tasteProfile: { spicy: 3, sour: 3, traditional: 5, budgetLevel: "high" },
    availableStock: 5
  },
  {
    id: "m3",
    title: "كاهي وقيمر سدة بصري طازج ☀️",
    cookId: "",
    cookName: "مطبخ بصري تراثي",
    price: 7000,
    category: "إفطار بصري",
    rating: 4.8,
    prepTime: "20 دقيقة",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    description: "طبق الكاهي الذهبي المقرمش مع القيمر الطبيعي والشيرة المعطرة بماء الهيل البصري الأصيل.",
    isNightFood: false,
    isBreakfast: true,
    isSurplus: false,
    tasteProfile: { spicy: 0, sour: 0, traditional: 4, budgetLevel: "low" },
    availableStock: 15
  },
  {
    id: "m4",
    title: "مرقة بامية باللحم الضأن والتمن الأحمر 🍲",
    cookId: "",
    cookName: "مطبخ بصري تراثي",
    price: 12000,
    category: "أطباق رئيسية",
    rating: 4.9,
    prepTime: "40 دقيقة",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    description: "بامية صغيرة مطبوخة على الطريقة البصرية القديمة مع الثوم وحامض اللومي ومعجون الطماطم العراقي ولحم الغنم الصافي.",
    isNightFood: false,
    isBreakfast: false,
    isSurplus: false,
    tasteProfile: { spicy: 1, sour: 4, traditional: 5, budgetLevel: "medium" },
    availableStock: 10
  },
  {
    id: "m5",
    title: "دولمة بصرية بالحامض والدبس 🍋",
    cookId: "",
    cookName: "مطبخ بصري تراثي",
    price: 14000,
    category: "أطباق رئيسية",
    rating: 5.0,
    prepTime: "45 دقيقة",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
    description: "دولمة سلق وبصل وفلفل محشوة بلحم الغنم والرز والعصب مع دبس الرمان والحامض البصري.",
    isNightFood: true,
    isBreakfast: false,
    isSurplus: false,
    tasteProfile: { spicy: 2, sour: 5, traditional: 5, budgetLevel: "medium" },
    availableStock: 7
  },
  {
    id: "m6",
    title: "وجبة شاورما بصرية ليلية فوق الجسر 🌙",
    cookId: "",
    cookName: "مطبخ بصري تراثي",
    price: 6000,
    category: "أكلات ليلية",
    rating: 4.7,
    prepTime: "15-25 دقيقة",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80",
    description: "صاج شاورما متبل ببهارات ليلية خاصة مع البطاطا المقرمشة ومخلل الخيار والثومية البصرية.",
    isNightFood: true,
    isBreakfast: false,
    isSurplus: false,
    tasteProfile: { spicy: 4, sour: 2, traditional: 2, budgetLevel: "low" },
    availableStock: 20
  }
];

export const MOCK_CHALLENGES = [
  {
    id: "ch1",
    title: "تحدي تذوق المسقوف البصري 🐟",
    description: "اطلب وجبتين مسقوف واحصل على وسام 'عاشق المسقوف' وخصم 15%!",
    badgeReward: "عاشق المسقوف 🐟",
    progress: 0,
    target: 2,
    pointsReward: 150
  },
  {
    id: "ch2",
    title: "صديق البيئة وإنقاذ الطعام 🌿",
    description: "اشترِ وجبات من قسم Food Rescue لتساهم في تقليل الهدر والحصول على وسام 'صديق النعمة'.",
    badgeReward: "صديق النعمة 💚",
    progress: 0,
    target: 3,
    pointsReward: 200
  },
  {
    id: "ch3",
    title: "مستكشف نكهات البصرة 🌶️",
    description: "جرب ميزة Flavor Match واستخدم التوصيات لطلب 3 وجبات تناسب ذوقك الفريد.",
    badgeReward: "مستكشف النكهات 🎯",
    progress: 0,
    target: 3,
    pointsReward: 100
  }
];

export const MOCK_SECRET_RECIPES = [];
export const MOCK_BARTER_ITEMS = [];

// صور تراثية حقيقية للبصرة (الشناشيل، النخيل، شط العرب، الجسر الإيطالي) لاستخدامها في الهيدر والبانرات
export const BASRA_IMAGES = {
  shanasheel: "https://images.unsplash.com/photo-1578898835028-09770dfcb193?w=1200&auto=format&fit=crop&q=80", // معمار تراثي شرقي
  palms: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80", // نخيل وبساتين
  river: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80", // مياه وغروب
  spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80", // بهارات وحوايج
  masgouf: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&auto=format&fit=crop&q=80" // مسقوف
};
