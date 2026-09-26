const analyzeCustomOrder = ({ description, budget, special_instructions }) => {
    const text = `${description || ""} ${special_instructions || ""}`.toLowerCase();

    const detectedTags = [];

    const keywords = {
        iraqi: ["عراقي", "iraqi", "تراثي", "traditional"],
        rice: ["رز", "rice", "تشريب", "تمن"],
        meat: ["لحم", "meat", "لحم غنم", "غنم"],
        chicken: ["دجاج", "chicken"],
        fish: ["سمك", "fish"],
        vegetarian: ["نباتي", "vegetarian", "خضار"],
        spicy: ["حار", "spicy", "حر"],
        dessert: ["حلو", "حلويات", "dessert", "كيك", "cake"],
        pastries: ["معجنات", "pastry", "فطائر"],
        family: ["عائلي", "family"],
        event: ["حفلة", "مناسبة", "event", "عيد", "birthday", "زواج"]
    };

    for (const [tag, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            detectedTags.push(tag);
        }
    }

    let budgetLevel = "not_specified";

    if (budget !== undefined && budget !== null && Number(budget) > 0) {
        const value = Number(budget);

        if (value < 25000) {
            budgetLevel = "low";
        } else if (value < 75000) {
            budgetLevel = "medium";
        } else {
            budgetLevel = "high";
        }
    }

    let priority = "standard";

    if (
        text.includes("مهم") ||
        text.includes("عاجل") ||
        text.includes("urgent") ||
        text.includes("important")
    ) {
        priority = "high";
    }

    return {
        detected_tags: detectedTags,
        budget_level: budgetLevel,
        priority,
        summary: detectedTags.length > 0
            ? `تم تحليل الطلب وتحديد التفضيلات: ${detectedTags.join(", ")}`
            : "تم تحليل الطلب، ولم يتم تحديد تفضيلات غذائية محددة.",
        recommendation:
            budgetLevel === "low"
                ? "يفضل اختيار وجبات اقتصادية أو تقليل الكمية."
                : budgetLevel === "high"
                    ? "الميزانية تسمح بخيارات وطلبات مخصصة أكثر."
                    : "يفضل مراجعة الوصف والتعليمات مع الطباخ قبل تأكيد السعر."
    };
};

const recommendMealsForCustomOrder = ({
    meals,
    detectedTags,
    budget
}) => {
    const budgetValue = Number(budget || 0);

    return meals
        .filter(meal => meal.is_available && Number(meal.available_quantity) > 0)
        .map(meal => {
            const mealTags = Array.isArray(meal.tags)
                ? meal.tags.map(tag => String(tag).toLowerCase())
                : [];

            const matchedTags = detectedTags.filter(tag =>
                mealTags.includes(tag.toLowerCase())
            );

            let score = matchedTags.length * 20;

            if (budgetValue > 0 && Number(meal.price) <= budgetValue) {
                score += 30;
            }

            score += 10;

            return {
                id: meal.id,
                name: meal.name,
                description: meal.description,
                price: meal.price,
                tags: meal.tags,
                available_quantity: meal.available_quantity,
                cook_id: meal.cook_id,
                matched_tags: matchedTags,
                score
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
};

module.exports = {
    analyzeCustomOrder,
    recommendMealsForCustomOrder
};
