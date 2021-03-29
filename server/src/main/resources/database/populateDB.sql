INSERT INTO users (username, name, email, password, phone)
VALUES ('fertil', 'Илья Фертиков', 'if@mail.com', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+7(191)322-22-33'),
       ('molose', 'Сергей Молотков', 'sm@mail.com', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+7(191)223-33-22');
INSERT INTO roles(name)
VALUES ('ROLE_USER'),
       ('ROLE_ADMIN');
INSERT INTO user_roles(user_id, role_id)
VALUES ('1', '2'),
       ('2', '1');