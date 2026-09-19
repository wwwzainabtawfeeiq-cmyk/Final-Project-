-- =========================================
-- BasraFlavor Database Schema
-- =========================================

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'cook', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cook Profiles
CREATE TABLE cook_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    bio TEXT,
    phone VARCHAR(30),
    address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cook_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Categories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    cook_id INTEGER NOT NULL,
    category_id INTEGER,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    available_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (available_quantity >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_meal_cook
        FOREIGN KEY (cook_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_meal_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- Addresses
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100),
    address TEXT NOT NULL,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_address_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    chef_id INTEGER,
    address_id INTEGER,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0
        CHECK (total_amount >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'accepted',
                'rejected',
                'preparing',
                'ready',
                'delivered',
                'cancelled'
            )
        ),
    scheduled_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_chef
        FOREIGN KEY (chef_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_order_address
        FOREIGN KEY (address_id)
        REFERENCES addresses(id)
        ON DELETE SET NULL
);

-- Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    meal_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),

    CONSTRAINT fk_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_item_meal
        FOREIGN KEY (meal_id)
        REFERENCES meals(id)
        ON DELETE RESTRICT
);

-- Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    meal_id INTEGER,
    cook_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_meal
        FOREIGN KEY (meal_id)
        REFERENCES meals(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_cook
        FOREIGN KEY (cook_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Favorites
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    meal_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_favorite_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorite_meal
        FOREIGN KEY (meal_id)
        REFERENCES meals(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_favorite
        UNIQUE (customer_id, meal_id)
);

-- =========================================
-- CART & ORDER EXTENSIONS
-- =========================================

-- Carts
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Cart Items
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    meal_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_item_meal
        FOREIGN KEY (meal_id)
        REFERENCES meals(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_cart_meal
        UNIQUE (cart_id, meal_id)
);

-- Order Status History
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    changed_by INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_user
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- NOTIFICATIONS EXTENSION

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general'
        CHECK (type IN ('order', 'review', 'system', 'general')),
    related_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- INDEXES

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_meals_cook ON meals(cook_id);
CREATE INDEX idx_meals_category ON meals(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_chef ON orders(chef_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_cook ON reviews(cook_id);
CREATE INDEX idx_favorites_customer ON favorites(customer_id);
CREATE INDEX idx_carts_customer ON carts(customer_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- SEED DATA

INSERT INTO categories (name, description) VALUES
('Dolma', 'Iraqi dolma and stuffed vegetables'),
('Rice & Mahashi', 'Rice dishes and stuffed vegetables'),
('Tabees', 'Traditional Iraqi oven dishes'),
('Fish', 'Fish and seafood dishes'),
('Pastries', 'Homemade pastries and baked food'),
('Desserts', 'Homemade Iraqi and international desserts')
ON CONFLICT (name) DO NOTHING;

