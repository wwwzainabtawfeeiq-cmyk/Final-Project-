const pool = require("../config/db");

const createGroupOrder = async (req, res) => {
    try {
        const { chef_id, address_id, scheduled_at } = req.body;

        const result = await pool.query(
            `
            INSERT INTO group_orders
            (creator_id, chef_id, address_id, scheduled_at)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                req.user.id,
                chef_id || null,
                address_id || null,
                scheduled_at || null
            ]
        );

        await pool.query(
            `
            INSERT INTO group_order_members
            (group_order_id, customer_id)
            VALUES ($1, $2)
            `,
            [result.rows[0].id, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: "Group order created successfully",
            groupOrder: result.rows[0]
        });

    } catch (error) {
        console.error("Create group order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const joinGroupOrder = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await pool.query(
            `
            SELECT id, status
            FROM group_orders
            WHERE id = $1
            `,
            [groupId]
        );

        if (group.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group order not found"
            });
        }

        if (group.rows[0].status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Group order is not open"
            });
        }

        await pool.query(
            `
            INSERT INTO group_order_members
            (group_order_id, customer_id)
            VALUES ($1, $2)
            ON CONFLICT (group_order_id, customer_id) DO NOTHING
            `,
            [groupId, req.user.id]
        );

        res.json({
            success: true,
            message: "Joined group order successfully"
        });

    } catch (error) {
        console.error("Join group order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const addGroupOrderItem = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { meal_id, quantity } = req.body;

        if (!meal_id || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Meal and quantity are required"
            });
        }

        const member = await pool.query(
            `
            SELECT id
            FROM group_order_members
            WHERE group_order_id = $1
              AND customer_id = $2
            `,
            [groupId, req.user.id]
        );

        if (member.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group order"
            });
        }

        const meal = await pool.query(
            `
            SELECT id, price, cook_id
            FROM meals
            WHERE id = $1
            `,
            [meal_id]
        );

        if (meal.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }

        const group = await pool.query(
            `
            SELECT status, chef_id
            FROM group_orders
            WHERE id = $1
            `,
            [groupId]
        );

        if (group.rows.length === 0 || group.rows[0].status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Group order is not open"
            });
        }

        if (
            group.rows[0].chef_id &&
            Number(group.rows[0].chef_id) !== Number(meal.rows[0].cook_id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Meal must belong to the selected cook"
            });
        }

        if (!group.rows[0].chef_id) {
            await pool.query(
                `
                UPDATE group_orders
                SET chef_id = $1
                WHERE id = $2
                `,
                [meal.rows[0].cook_id, groupId]
            );
        }

        const result = await pool.query(
            `
            INSERT INTO group_order_items
            (
                group_order_id,
                meal_id,
                quantity,
                unit_price,
                added_by
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                groupId,
                meal_id,
                quantity,
                meal.rows[0].price,
                req.user.id
            ]
        );

        await pool.query(
            `
            UPDATE group_orders
            SET total_amount = (
                SELECT COALESCE(SUM(quantity * unit_price), 0)
                FROM group_order_items
                WHERE group_order_id = $1
            )
            WHERE id = $1
            `,
            [groupId]
        );

        res.status(201).json({
            success: true,
            message: "Meal added to group order successfully",
            item: result.rows[0]
        });

    } catch (error) {
        console.error("Add group order item error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getGroupOrder = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await pool.query(
            `
            SELECT
                go.*,
                u.name AS creator_name
            FROM group_orders go
            JOIN users u ON u.id = go.creator_id
            WHERE go.id = $1
            `,
            [groupId]
        );

        if (group.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group order not found"
            });
        }

        const members = await pool.query(
            `
            SELECT
                gom.id,
                gom.customer_id,
                u.name,
                u.email,
                gom.joined_at
            FROM group_order_members gom
            JOIN users u ON u.id = gom.customer_id
            WHERE gom.group_order_id = $1
            ORDER BY gom.joined_at
            `,
            [groupId]
        );

        const items = await pool.query(
            `
            SELECT
                goi.id,
                goi.meal_id,
                m.name AS meal_name,
                goi.quantity,
                goi.unit_price,
                goi.added_by,
                u.name AS added_by_name
            FROM group_order_items goi
            JOIN meals m ON m.id = goi.meal_id
            JOIN users u ON u.id = goi.added_by
            WHERE goi.group_order_id = $1
            ORDER BY goi.id
            `,
            [groupId]
        );

        res.json({
            success: true,
            groupOrder: group.rows[0],
            members: members.rows,
            items: items.rows
        });

    } catch (error) {
        console.error("Get group order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getMyGroupOrders = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT DISTINCT
                go.*,
                u.name AS creator_name
            FROM group_orders go
            JOIN group_order_members gom
                ON gom.group_order_id = go.id
            JOIN users u
                ON u.id = go.creator_id
            WHERE gom.customer_id = $1
            ORDER BY go.id DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            groupOrders: result.rows
        });

    } catch (error) {
        console.error("Get my group orders error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const confirmGroupOrder = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await pool.query(
            `
            SELECT *
            FROM group_orders
            WHERE id = $1
              AND creator_id = $2
            `,
            [groupId, req.user.id]
        );

        if (group.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group order not found or you are not the creator"
            });
        }

        if (group.rows[0].status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Group order cannot be confirmed"
            });
        }

        const items = await pool.query(
            `
            SELECT id
            FROM group_order_items
            WHERE group_order_id = $1
            `,
            [groupId]
        );

        if (items.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Group order has no meals"
            });
        }

        const result = await pool.query(
            `
            UPDATE group_orders
            SET status = 'confirmed'
            WHERE id = $1
            RETURNING *
            `,
            [groupId]
        );

        res.json({
            success: true,
            message: "Group order confirmed successfully",
            groupOrder: result.rows[0]
        });

    } catch (error) {
        console.error("Confirm group order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createGroupOrder,
    joinGroupOrder,
    addGroupOrderItem,
    getGroupOrder,
    getMyGroupOrders,
    confirmGroupOrder
};
