const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function protect(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id = $1",
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        console.error("Auth error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Not authorized"
        });
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();
    };
}

function authenticateToken(req, res, next) {
    return protect(req, res, next);
}

function authorizeRoles(...roles) {
    return authorize(...roles);
}

module.exports = {
    protect,
    authorize,
    authenticateToken,
    authorizeRoles
};