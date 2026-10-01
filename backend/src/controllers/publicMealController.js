const pool = require("../config/db");

const getPublicMeals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        m.name,
        m.name_ar,
        m.name_en,
        m.description,
        m.description_ar,
        m.description_en,
        m.price,
        m.category_id,
        m.cook_id,
        m.available_quantity,
        m.image_url,
        m.tags,
        m.created_at,

        u.name AS cook_name,
        u.name_ar AS cook_name_ar,
        u.name_en AS cook_name_en,

        c.name AS category_name,

        COALESCE(AVG(r.rating), 0) AS rating, COUNT(r.id)::int AS review_count

      FROM meals m

      INNER JOIN users u
        ON u.id = m.cook_id

      LEFT JOIN categories c
        ON c.id = m.category_id

      LEFT JOIN reviews r
        ON r.meal_id = m.id

      WHERE m.is_available = true

      GROUP BY
        m.id,
        u.name,
        u.name_ar,
        u.name_en,
        c.name

      ORDER BY m.created_at DESC
    `);

    const data = result.rows.map((meal) => ({
      ...meal,
      rating: Number(Number(meal.rating || 0).toFixed(1)),
      image: meal.image_url || "/default-meal.jpg",
    }));

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get public meals error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPublicMealById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        m.id,
        m.name,
        m.name_ar,
        m.name_en,
        m.description,
        m.description_ar,
        m.description_en,
        m.price,
        m.category_id,
        m.cook_id,
        m.available_quantity,
        m.image_url,
        m.tags,
        m.created_at,

        u.name AS cook_name,
        u.name_ar AS cook_name_ar,
        u.name_en AS cook_name_en,

        c.name AS category_name,

        COALESCE(AVG(r.rating), 0) AS rating, COUNT(r.id)::int AS review_count

      FROM meals m

      INNER JOIN users u
        ON u.id = m.cook_id

      LEFT JOIN categories c
        ON c.id = m.category_id

      LEFT JOIN reviews r
        ON r.meal_id = m.id

      WHERE m.id = $1

      GROUP BY
        m.id,
        u.name,
        u.name_ar,
        u.name_en,
        c.name
      `,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    const meal = result.rows[0];

    res.json({
      success: true,
      data: {
        ...meal,
        rating: Number(Number(meal.rating || 0).toFixed(1)),
        image: meal.image_url || "/default-meal.jpg",
      },
    });
  } catch (error) {
    console.error("Get public meal error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getPublicMeals,
  getPublicMealById,
};

