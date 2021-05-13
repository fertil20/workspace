INSERT INTO users (username, name, email, password, phone, tg, about, position, department,
                   office, start_at, end_at, birthday, secret_note, status, status_date_start, status_date_finish)
VALUES ('fertil', 'Илья Фертиков', 'fertil@list.ru', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+74235335346', 'fertil13', 'Меня зовут Илья', 'Просто Илья', 'Северный Град', '215', '09:00', '18:00', '2000.09.13', 'секрет', '0', '2000.11.18', '2000.11.18'),
       ('molose', 'Сергей Молотков', 'bekran@mail.ru', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+74235335345', 'molose14', 'Меня зовут Серёжа', 'Сэр', 'Северный Град', '397', '09:00', '18:00', '2000.11.18',  'секрет', '0', '2000.11.18', '2000.11.18'),
       ('hunt_roar', 'Шамрикова Анна', '5hunt.roar5@gmail.com', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+74235335344', 'anna55', 'Меня зовут Аня', 'Мисс', 'Северный Град', '232', '09:00', '18:00', '2000.12.23', 'не секрет', '1', '2000.11.18', '2000.11.18');

INSERT INTO roles (name, privileges)
VALUES ('Пользователь', 'View'),
       ('Администратор', 'Manage_Users,Manage_Roles,View_Secret,Edit_Users,Manage_News,Edit_About,Booking');

INSERT INTO rooms (address, about, max_people)
VALUES ('Богатырский 37 к2, кв33', 'Просторная кухня, на которой можно перетереть за любой вопрос международного уровня', 8),
       ('Литейный 45', 'Я хз, что там', 127),
       ('Комендантский 52', 'Хорошо там, где нас нет', 15),
       ('Дискорд, канал "Управление требованиями"', 'Прекрасное место для деловых переговоров во время пандемии, а также для интровертов', 50);

INSERT INTO users_roles (user_id, role_name)
VALUES ('1', 'Пользователь'),
       ('1', 'Администратор'),
       ('2', 'Пользователь'),
       ('2', 'Администратор'),
       ('3', 'Пользователь'),
       ('3', 'Администратор');