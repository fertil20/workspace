package com.workspace.server.rest;

import com.workspace.server.dto.UserBirthdayListResponse;
import com.workspace.server.dto.UserIdentityAvailability;
import com.workspace.server.dto.UserSummary;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.security.CurrentUser;
import com.workspace.server.security.UserPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final UserRepository userRepository;

    public ApiController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('View')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        return new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName(), currentUser.getPrivileges());
    }

    @GetMapping("/auth/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/auth/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @PostMapping("/deleteUser/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('Manage_Users')")
    public void deleteUser(@PathVariable(value = "id") Long id) {
        userRepository.deleteMeetingsAssociations(id);
        userRepository.deleteById(id);
    }

    @GetMapping("/birthdays")
    @PreAuthorize("hasAuthority('View')")
    public List<UserBirthdayListResponse> getUsersBirthday() {
        return userRepository.findAll().stream()
                .map(user -> new UserBirthdayListResponse(user.getId(), user.getUsername(), user.getName(), user.getBirthday()))
                .collect(Collectors.toList());
    }
}
