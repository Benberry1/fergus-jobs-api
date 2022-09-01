BEGIN TRANSACTION;

CREATE TYPE status AS ENUM ('scheduled', 'active', 'invoicing', 'to price', 'completed');

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone VARCHAR(15),
    street TEXT,
    suburb TEXT,
    city TEXT,
    region TEXT, 
    country TEXT,
    postcode INT,
    constraint postcode
        check (postcode <= 9999)
);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY, 
    status status,
    -- timestamp created by DB but seed data has created timestamp data inserted
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_id INT REFERENCES customer(id),
    notes TEXT ARRAY
);

COMMIT;