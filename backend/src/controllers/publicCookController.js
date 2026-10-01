const pool = require("../config/db");

const getPublicCooks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.name_ar,
        u.name_en,
        u.image_url,
        cp.bio,
        cp.bio_ar,
        cp.bio_en,
        cp.phone,
        cp.address,
        cp.is_verified
      FROM users u
      INNER JOIN cook_profiles cp
        ON cp.user_id = u.id
      WHERE u.role = 'cook'
      ORDER BY u.id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get public cooks error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getPublicCookById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.name,
        u.name_ar,
        u.name_en,
        u.image_url,
        cp.bio,
        cp.bio_ar,
        cp.bio_en,
        cp.phone,
        cp.address,
        cp.is_verified
      FROM users u
      INNER JOIN cook_profiles cp
        ON cp.user_id = u.id
      WHERE u.id = $1
        AND u.role = 'cook'
      `,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Cook not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get public cook error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getPublicCooks,
  getPublicCookById,
};
