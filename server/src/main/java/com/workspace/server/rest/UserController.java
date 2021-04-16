package com.workspace.server.rest;

import com.workspace.server.exception.AppException;
import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.Role;
import com.workspace.server.model.RoleName;
import com.workspace.server.model.User;
import com.workspace.server.payload.*;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserProfile> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                        user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getWorkTimes()))
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
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));


        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getWorkTimes());
    }

    @GetMapping("/{username}/edit")
    public UserProfile getUserEdit(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));


        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), user.getEmail(), user.getPhone(), user.getTg(), user.getAbout(),
                user.getPosition(), user.getDepartment(), user.getOffice(), user.getBirthday(), user.getSecretNote(), user.getStatus(), user.getWorkTimes());
    }

/*    @PostMapping("/{username}/edit")
    public String editUserProfile (@PathVariable(value = "username") String username,
                                   @RequestBody List<toString> devices) throws IOException {
        return "success";
    }*/
    @PostMapping("/{username}/edit")
    public ResponseEntity<?> editUserProfile(@PathVariable(value = "username") String username,
                                  @RequestParam String email, @RequestParam String phone, @RequestParam String tg,
                                  @RequestParam String name, @RequestParam String about, @RequestParam String position,
                                  @RequestParam String department, @RequestParam String office, @RequestParam String secretNote,
                                  @RequestParam char status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        user.setEmail(email);
        user.setPhone(phone);
        user.setTg(tg);
        user.setName(name);
        user.setAbout(about);
        user.setPosition(position);
        user.setDepartment(department);
        user.setOffice(office);
        user.setSecretNote(secretNote);
        user.setStatus(status);
        User result = userRepository.save(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/users/{username}/edit")
                .buildAndExpand(result.getUsername()).toUri();
        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }

}