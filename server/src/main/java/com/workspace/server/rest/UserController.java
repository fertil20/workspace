package com.workspace.server.rest;

import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.User;
import com.workspace.server.dto.*;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

/*    private static final Logger logger = LoggerFactory.getLogger(UserController.class);*/

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserProfile> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                        user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getStartAt(), user.getEndAt()))
                .collect(Collectors.toList());
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN, USER')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        return new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
    }

    @GetMapping("/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) throws ParseException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));


        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getStartAt(), user.getEndAt());
    }

    @PostMapping("/{username}/edit")
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

    @PostMapping("/delete/{id}")
    public void deleteUser(@PathVariable(value = "id") Long id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/new")
    public void createUserProfile(@RequestBody User request) {
        User user = new User();
        user.setPassword(request.getPassword()); //todo сгенерить и отправить пароль
        user.setBirthday(request.getBirthday());
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
}