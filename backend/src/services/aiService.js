const normalize = (value) => {
    return String(value || "").trim().toLowerCase();
};

const containsAny = (text, values = []) => {
    const normalizedText = normalize(text);

    return values.some(value =>
        normalizedText.includes(normalize(value))
    );
};

const calculateMatchScore = ({
    mealText = "",
    favoriteFoods = [],
    dislikedFoods = [],
    price = null,
    budgetMin = null,
    budgetMax = null
}) => {
    let score = 50;
    const reasons = [];
    const conflicts = [];

    if (containsAny(mealText, favoriteFoods)) {
        score += 30;
        reasons.push("Matches favorite foods");
    }

    if (containsAny(mealText, dislikedFoods)) {
        score -= 40;
        conflicts.push("Contains a disliked food");
    }

    if (price !== null && budgetMin !== null && budgetMax !== null) {
        if (
            Number(price) >= Number(budgetMin) &&
            Number(price) <= Number(budgetMax)
        ) {
            score += 20;
            reasons.push("Within preferred budget");
        }
    }

    score = Math.max(0, Math.min(100, score));

    return {
        score,
        reasons,
        conflicts
    };
};


const parseSmartSearch = (query) => {
    const text = normalize(query);

    const result = {
        keywords: [],
        max_price: null,
        min_price: null
    };

    const priceMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:الف|ألف|k|دينار|د\.?ع)?/);

    if (priceMatch) {
        const number = Number(priceMatch[1]);

        if (text.includes("الف") || text.includes("ألف") || text.includes("k")) {
            result.max_price = number * 1000;
        } else if (
            text.includes("دينار") ||
            text.includes("د.ع") ||
            text.includes("د ع")
        ) {
            result.max_price = number;
        }
    }

    const stopWords = [
        "اريد",
        "أريد",
        "اكل",
        "أكل",
        "وجبة",
        "وجبه",
        "طعام",
        "اكلات",
        "أكلات",
        "بسعر",
        "بحدود",
        "حدود",
        "دينار",
        "الف",
        "ألف",
        "k"
    ];

    const words = text
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word =>
            word.length > 1 &&
            !stopWords.includes(word) &&
            !/^\d+$/.test(word)
        );

    result.keywords = [...new Set(words)];

    return result;
};


module.exports = {
    normalize,
    containsAny,
    calculateMatchScore,
    parseSmartSearch
};
