DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users
(
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  UNIQUE NOT NULL,
    name     VARCHAR(200) NOT NULL,
    email    VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(20)  NOT NULL,
    phone    VARCHAR(50)  NOT NULL
);

DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE IF NOT EXISTS roles
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS user_roles CASCADE;
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_role_id
        FOREIGN KEY (role_id)
            REFERENCES roles (id),
    CONSTRAINT fk_user_roles_user_id
        FOREIGN KEY (user_id)
            REFERENCES users (id)
);
CREATE INDEX fk_user_roles_role_id ON user_roles (role_id);