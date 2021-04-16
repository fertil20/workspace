DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users
(
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(50)  UNIQUE NOT NULL,
    name     VARCHAR(200) NOT NULL,
    email    VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone    VARCHAR(50) UNIQUE NOT NULL,
    tg       VARCHAR(30) UNIQUE NOT NULL,
    about    VARCHAR(300),
    position VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    office   VARCHAR(3) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    birthday DATE /*NOT NULL*/,
    secret_note VARCHAR(300),
    reset_password_token VARCHAR(30)
);

DROP TABLE IF EXISTS working_hours CASCADE;
CREATE TABLE IF NOT EXISTS working_hours (
    id BIGSERIAL PRIMARY KEY,
    time VARCHAR(11)
);

DROP TABLE IF EXISTS working_days CASCADE;
CREATE TABLE IF NOT EXISTS working_days (
    id BIGSERIAL PRIMARY KEY,
    weekday VARCHAR(2) NOT NULL
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

DROP TABLE IF EXISTS user_hours CASCADE;
CREATE TABLE IF NOT EXISTS user_hours (
    user_id BIGINT NOT NULL,
    hours_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, hours_id),
    CONSTRAINT fk_user_hours_hours_id
        FOREIGN KEY (hours_id)
            REFERENCES working_hours (id),
            CONSTRAINT fk_user_hours_user_id
                FOREIGN KEY (user_id)
                    REFERENCES users (id)
);
CREATE INDEX fk_user_hours_hours_id ON user_hours (hours_id);

DROP TABLE IF EXISTS user_days CASCADE;
CREATE TABLE IF NOT EXISTS user_days (
    user_id BIGINT NOT NULL,
    days_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, days_id),
    CONSTRAINT fk_user_days_days_id
        FOREIGN KEY (days_id)
            REFERENCES working_days (id),
            CONSTRAINT fk_user_days_user_id
                FOREIGN KEY (user_id)
                    REFERENCES users (id)
);
CREATE INDEX fk_user_days_days_id ON user_days (days_id);