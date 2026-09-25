const pool = require("../config/db");

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, email, role, created_at
            FROM users
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            users: result.rows
        });

    } catch (error) {
        console.error("Admin get users error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT id, name, email, role, created_at
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Admin get user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ["customer", "cook", "admin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot change their own role"
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET role = $1
            WHERE id = $2
            RETURNING id, name, email, role, created_at
            `,
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User role updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Admin update role error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot delete their own account"
            });
        }

        const result = await pool.query(
            `
            DELETE FROM users
            WHERE id = $1
            RETURNING id, name, email, role
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Admin delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUserRole,
    deleteUser
};