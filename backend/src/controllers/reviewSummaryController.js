const pool = require("../config/db");

const positiveWords = [
    "لذيذ",
    "لذيذة",
    "طيب",
    "طيبة",
    "رائع",
    "رائعة",
    "ممتاز",
    "ممتازة",
    "حلو",
    "حلوة",
    "نظيف",
    "نظيفة",
    "سريع",
    "سريعة",
    "delicious",
    "great",
    "excellent",
    "good",
    "clean",
    "fast"
];

const negativeWords = [
    "سيء",
    "سيئة",
    "مو حلو",
    "مالح",
    "مالحة",
    "بارد",
    "باردة",
    "غالي",
    "غالية",
    "متأخر",
    "متأخرة",
    "سيئ",
    "bad",
    "poor",
    "salty",
    "cold",
    "expensive",
    "late"
];

const normalize = (text) =>
    String(text || "").trim().toLowerCase();

const findRepeatedWords = (comments, words) => {
    const counts = {};

    comments.forEach(comment => {
        const text = normalize(comment);

        words.forEach(word => {
            if (text.includes(normalize(word))) {
                counts[word] = (counts[word] || 0) + 1;
            }
        });
    });

    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => ({
            word,
            mentions: count
        }));
};

const getMealReviewSummary = async (req, res) => {
    try {
        const mealId = req.params.mealId;

        const result = await pool.query(
            `SELECT rating, comment
             FROM reviews
             WHERE meal_id = $1
             ORDER BY created_at DESC`,
            [mealId]
        );

        const reviews = result.rows;

        if (reviews.length === 0) {
            return res.json({
                success: true,
                data: {
                    meal_id: Number(mealId),
                    total_reviews: 0,
                    average_rating: 0,
                    positive_percentage: 0,
                    negative_percentage: 0,
                    summary: "لا توجد تقييمات كافية لإنشاء ملخص حالياً.",
                    common_positive_points: [],
                    common_negative_points: []
                }
            });
        }

        const totalReviews = reviews.length;

        const averageRating =
            reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
            totalReviews;

        const positiveReviews =
            reviews.filter(review => Number(review.rating) >= 4).length;

        const negativeReviews =
            reviews.filter(review => Number(review.rating) <= 2).length;

        const comments = reviews
            .map(review => review.comment)
            .filter(Boolean);

        const positivePoints = findRepeatedWords(
            comments,
            positiveWords
        );

        const negativePoints = findRepeatedWords(
            comments,
            negativeWords
        );

        let summary;

        if (averageRating >= 4) {
            summary = "آراء المستخدمين إيجابية بشكل عام.";
        } else if (averageRating >= 3) {
            summary = "آراء المستخدمين متوسطة بشكل عام.";
        } else {
            summary = "آراء المستخدمين تحتاج إلى تحسين.";
        }

        res.json({
            success: true,
            data: {
                meal_id: Number(mealId),
                total_reviews: totalReviews,
                average_rating: Number(averageRating.toFixed(2)),
                positive_percentage: Number(
                    ((positiveReviews / totalReviews) * 100).toFixed(1)
                ),
                negative_percentage: Number(
                    ((negativeReviews / totalReviews) * 100).toFixed(1)
                ),
                summary,
                common_positive_points: positivePoints,
                common_negative_points: negativePoints
            }
        });

    } catch (error) {
        console.error("AI Review Summary error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getMealReviewSummary
};
