package com.workspace.server.rest;

import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.Role;
import com.workspace.server.model.User;
import com.workspace.server.dto.*;
import com.workspace.server.repository.RoleRepository;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.text.ParseException;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserController {


    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/users")
    public List<UserProfile> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                        user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getStartAt(), user.getEndAt()))
                .collect(Collectors.toList());
    }

    @GetMapping("/users/me")
    @PreAuthorize("hasRole('User')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        return new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
    }

    @GetMapping("/users/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) throws ParseException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));


        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getStartAt(), user.getEndAt());
    }

    @PostMapping("/users/{username}/edit")
    public void editUserProfile(@PathVariable(value = "username") String username,
                                                       @RequestBody ProfileEditRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        user.setEmail(request.getEmail());
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
        userRepository.save(user);
    }

    @PostMapping("/users/delete/{id}")
    public void deleteUser(@PathVariable(value = "id") Long id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/newUser")
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

        Role role = roleRepository.findByName("ROLE_User");

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

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(role -> new Role(role.getName()))
                .collect(Collectors.toList());
    }

    @PostMapping("/roles")
    public void setNewRole(@RequestBody Role request) {
        Role role = new Role();
        role.setName(request.getName());
        roleRepository.save(role);
    }

    @GetMapping("/roles/{role}")
    public List<User> getRoleUsers(@PathVariable Collection<Collection<Role>> role) {
        return userRepository.findByRolesIn(role).stream()
                .map(user -> new User(user.getName(), user.getPosition(), user.getDepartment()))
                .collect(Collectors.toList());
    }
}