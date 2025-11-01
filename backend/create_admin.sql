-- Create admin user
-- Password: Admin@123

INSERT INTO users (
    first_name,
    last_name,
    email,
    phone,
    password,
    user_type,
    status,
    is_approved,
    email_verified_at,
    created_at,
    updated_at
) VALUES (
    'Admin',
    'Edvance',
    'admin@edvance.com',
    '+201234567890',
    '$2y$12$KbAKkRZhKrYOn/4hEpvZKeAZ78PCqd4k1E4d8zbAH/.axkavkyYsG',
    'admin',
    'active',
    1,
    NOW(),
    NOW(),
    NOW()
);
