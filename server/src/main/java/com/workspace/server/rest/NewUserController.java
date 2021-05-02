package com.workspace.server.rest;

import com.workspace.server.model.Role;
import com.workspace.server.model.User;
import com.workspace.server.repository.RoleRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class NewUserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public NewUserController(UserRepository userRepository, RoleRepository roleRepository, JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/newUser")
    @PreAuthorize("hasAuthority('Manage_Users')")
    public void createUserProfile(@RequestBody User request) throws MessagingException, UnsupportedEncodingException {
        User user = new User();
        String username = request.getUsername();

        String password = new SecureRandom()
                .ints(8, '!', '{')
                .mapToObj(i -> String.valueOf((char)i))
                .collect(Collectors.joining());

        String email = request.getEmail();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setBirthday(request.getBirthday());
        user.setPhone(request.getPhone());
        user.setTg(request.getTg());
        user.setName(request.getName());
        user.setAbout(request.getAbout());
        user.setPosition(request.getPosition());
        user.setDepartment(request.getDepartment());
        user.setOffice(request.getOffice());
        user.setStartAt(request.getStartAt());
        user.setEndAt(request.getEndAt());
        user.setSecretNote(request.getSecretNote());
        user.setStatus(request.getStatus());

        Role role = roleRepository.getOne("Пользователь");

        user.setRoles(Collections.singleton(role));

        userRepository.save(user);

        sendEmail(email, password, username);
    }

    public void sendEmail(String recipientEmail, String password, String username)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("workspace.app.8371@gmail.com", "Workspace Support");
        helper.setTo(recipientEmail);

        String subject = "Добро пожаловать в систему!";

        String content = "<p>Добро пожаловать!</p>"
                + "<p>Вы были зарегистрированы в системе и теперь можете перейти к ней по ссылке:</p>"
                + "<p><a href=\"http://localhost:3000\">Перейти к системе</a></p>"
                + "<p>Ваш логин: " + username + "</p>"
                + "<p>Ваш пароль: " + password + "</p>";

        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }
}
