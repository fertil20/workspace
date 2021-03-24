DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users
(
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  NOT NULL,
    name     VARCHAR(200) NOT NULL,
    email    VARCHAR(254) NOT NULL,
    password VARCHAR(20)  NOT NULL,
    phone    VARCHAR(50)  NOT NULL
);