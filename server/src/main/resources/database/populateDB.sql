INSERT INTO users (username, name, email, password, phone, tg, about, position, department,
                   office, start_at, end_at, birthday, secret_note, status, status_date_start, status_date_finish)
VALUES ('fertil', 'Илья Фертиков', 'fertil@list.ru', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+7 (191) 322-22-33', 'fertil13', 'Меня зовут Илья', 'Просто Илья', 'Северный Град', '215', '09:00', '18:00', '2000.09.13', 'секрет', '0', '2000.11.18', '2000.11.18'),
       ('molose', 'Сергей Молотков', 'bekran@mail.ru', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+7 (191) 223-33-22', 'molose14', 'Меня зовут Серёжа', 'Сэр', 'Северный Град', '397', '09:00', '18:00', '2000.11.18',  'секрет', '0', '2000.11.18', '2000.11.18'),
       ('hunt_roar', 'Шамрикова Анна', '5hunt.roar5@gmail.com', '$2b$10$QLXUPVP.ihTNij6tg/f0Kubfu2b8b4Ty9Ur0V1KnlgF1fE5iL7Gia', '+7 (423) 533-53-44', 'anna55', 'Меня зовут Аня', 'Мисс', 'Северный Град', '232', '09:00', '18:00', '2000.12.23', 'не секрет', '1', '2000.11.18', '2000.11.18');
INSERT INTO roles(name)
VALUES ('User'),
       ('Admin');
/*INSERT INTO working_hours(time)
VALUES ('06:00-14:00'), ('07:00-15:00'), ('08:00-16:00'), ('09:00-17:00'), ('10:00-18:00'),
       ('11:00-19:00'), ('12:00-20:00'), ('13:00-21:00'), ('14:00-22:00');
INSERT INTO working_days(weekday)
VALUES ('ПН'), ('ВТ'), ('СР'), ('ЧТ'), ('ПТ'), ('СБ'), ('ВС');*/
INSERT INTO user_roles(user_id, role_id)
VALUES ('1', '1'),
       ('1', '2'),
       ('2', '1'),
       ('2', '2'),
       ('3', '1'),
       ('3', '2');
/*INSERT INTO user_hours(user_id, hours_id)
VALUES ('1', '5'),
       ('1', '7'),
       ('2', '3');
INSERT INTO user_days(user_id, days_id)
VALUES ('1', '4'),
       ('2', '3');*/