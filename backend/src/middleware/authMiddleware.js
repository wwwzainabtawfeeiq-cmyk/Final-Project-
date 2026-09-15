const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// @desc    Verify JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const result = await pool.query(
                'SELECT id, name, email, role FROM users WHERE id = $1',
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            req.user = result.rows[0];
            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
};

// @desc    Role-based authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized for this action`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
