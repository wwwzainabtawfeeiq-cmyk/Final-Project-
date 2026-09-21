// mockData/data.js - ملف بيانات مفرغ بالكامل (بدون وجبات وبدون أشخاص وهميين)

export const MOCK_COOKS = [];

export const MOCK_MEALS = [];

export const MOCK_CHALLENGES = [
  {
    id: "ch1",
    title: "تحدي تذوق المسقوف البصري 🐟",
    description: "اطلب وجبتين مسقوف واحصل على وسام 'عاشق المسقوف' وخصم 15%!",
    badgeReward: "عاشق المسقوف",
    progress: 0,
    target: 2,
    pointsReward: 150
  },
  {
    id: "ch2",
    title: "صديق البيئة وإنقاذ الطعام 🌿",
    description: "اشترِ وجبات من قسم Food Rescue لتساهم في تقليل الهدر والحصول على وسام 'صديق النعمة'.",
    badgeReward: "صديق النعمة",
    progress: 0,
    target: 3,
    pointsReward: 200
  },
  {
    id: "ch3",
    title: "مستكشف نكهات البصرة 🌶️",
    description: "جرب ميزة Flavor Match واستخدم التوصيات لطلب 3 وجبات تناسب ذوقك الفريد.",
    badgeReward: "مستكشف النكهات",
    progress: 0,
    target: 3,
    pointsReward: 100
  }
];

export const MOCK_SECRET_RECIPES = [];
export const MOCK_BARTER_ITEMS = [];
