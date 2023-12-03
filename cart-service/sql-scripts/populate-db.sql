INSERT INTO users (name, email) VALUES
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Alice Johnson', 'alice.johnson@example.com'),
('Bob Brown', 'bob.brown@example.com'),
('Emma Wilson', 'emma.wilson@example.com');

INSERT INTO stores (title) VALUES
('Store A'),
('Store B'),
('Store C'),
('Store D'),
('Store E');

INSERT INTO products (title, store_id) VALUES
('Product 1', (SELECT id FROM stores WHERE title = 'Store A')),
('Product 2', (SELECT id FROM stores WHERE title = 'Store B')),
('Product 3', (SELECT id FROM stores WHERE title = 'Store C')),
('Product 4', (SELECT id FROM stores WHERE title = 'Store D')),
('Product 5', (SELECT id FROM stores WHERE title = 'Store E'));

INSERT INTO carts (user_id, status) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'), 'OPEN'),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), 'OPEN'),
((SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 'ORDERED'),
((SELECT id FROM users WHERE email = 'bob.brown@example.com'), 'ORDERED'),
((SELECT id FROM users WHERE email = 'emma.wilson@example.com'), 'OPEN');

INSERT INTO cart_items (cart_id, product_id, count) VALUES
((SELECT id FROM carts LIMIT 1), (SELECT id FROM products WHERE title = 'Product 1'), 2),
((SELECT id FROM carts LIMIT 1), (SELECT id FROM products WHERE title = 'Product 2'), 3),
((SELECT id FROM carts LIMIT 1), (SELECT id FROM products WHERE title = 'Product 3'), 1),
((SELECT id FROM carts OFFSET 1 LIMIT 1), (SELECT id FROM products WHERE title = 'Product 4'), 4),
((SELECT id FROM carts OFFSET 1 LIMIT 1), (SELECT id FROM products WHERE title = 'Product 5'), 5);

INSERT INTO orders (user_id, cart_id, payment, delivery, comments, status, total) VALUES
((SELECT id FROM users WHERE email = 'john.doe@example.com'), (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'john.doe@example.com')), '{"method":"card"}', '{"address":"123 Street"}', 'No comments', 'PENDING', 100.00),
((SELECT id FROM users WHERE email = 'jane.smith@example.com'), (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'jane.smith@example.com')), '{"method":"paypal"}', '{"address":"456 Avenue"}', 'Urgent delivery', 'SHIPPED', 150.00),
((SELECT id FROM users WHERE email = 'alice.johnson@example.com'), (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'alice.johnson@example.com')), '{"method":"card"}', '{"address":"789 Boulevard"}', 'Gift wrap', 'DELIVERED', 200.00),
((SELECT id FROM users WHERE email = 'bob.brown@example.com'), (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'bob.brown@example.com')), '{"method":"cash"}', '{"address":"1011 Park"}', 'Leave at front door', 'CANCELLED', 50.00),
((SELECT id FROM users WHERE email = 'emma.wilson@example.com'), (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE email = 'emma.wilson@example.com')), '{"method":"card"}', '{"address":"1213 Lane"}', 'Call on arrival', 'PENDING', 75.00);