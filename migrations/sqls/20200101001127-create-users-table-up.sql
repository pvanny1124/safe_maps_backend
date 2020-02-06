CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password char(60) NOT NULL,
    created_at timestamp default current_timestamp
);
