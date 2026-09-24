const pool = require("../config/db");
const { parseSmartSearch, normalize } = require("../services/aiService");

const keywordMap = {
    "عراقي": ["iraqi", "traditional"],
    "بيتوتي": ["homemade"],
    "منزلي": ["homemade"],
    "رز": ["rice"],
    "تقليدي": ["traditional"]
};

const smartSearch = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const parsed = parseSmartSearch(query);

        const expandedKeywords = [];

        parsed.keywords.forEach(keyword => {
            expandedKeywords.push(normalize(keyword));

            const mapped = keywordMap[normalize(keyword)] || [];
            expandedKeywords.push(...mapped);
        });

        const uniqueKeywords = [...new Set(expandedKeywords)];

        const result = await pool.query(`
            SELECT
                m.id,
                m.name,
                m.description,
                m.price,
                m.category_id,
                m.cook_id,
                m.available_quantity,
                m.tags
            FROM meals m
            WHERE m.available_quantity > 0
              AND (
                    $1::numeric IS NULL
                    OR m.price <= $1
              )
              AND (
                    COALESCE(array_length($2::text[], 1), 0) = 0
                    OR EXISTS (
                        SELECT 1
                        FROM unnest($2::text[]) AS keyword
                        WHERE
                            LOWER(COALESCE(m.name, '')) LIKE '%' || keyword || '%'
                            OR LOWER(COALESCE(m.description, '')) LIKE '%' || keyword || '%'
                            OR EXISTS (
                                SELECT 1
                                FROM unnest(COALESCE(m.tags, ARRAY[]::text[])) AS tag
                                WHERE LOWER(tag) LIKE '%' || keyword || '%'
                            )
                    )
              )
            ORDER BY m.id DESC
        `, [
            parsed.max_price,
            uniqueKeywords
        ]);

        res.json({
            success: true,
            query,
            interpreted_as: {
                ...parsed,
                expanded_keywords: uniqueKeywords
            },
            results_count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error("Smart search error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    smartSearch
};
