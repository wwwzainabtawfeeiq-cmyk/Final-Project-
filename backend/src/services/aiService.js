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
        if (Number(price) >= Number(budgetMin) &&
            Number(price) <= Number(budgetMax)) {
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

module.exports = {
    normalize,
    containsAny,
    calculateMatchScore
};
