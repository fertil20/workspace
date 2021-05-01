package com.workspace.server.rest;

import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.Role;
import com.workspace.server.model.User;
import com.workspace.server.repository.RoleRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public RoleController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(role -> new Role(role.getName()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public void setNewRole(@RequestBody Role request) {
        Role role = new Role();
        role.setName(request.getName());
        roleRepository.save(role);
    }

    @GetMapping("/{role}")
    public List<User> getRoleUsers(@PathVariable String role) {
        return roleRepository.getOne(role).getUsers().stream()
                .map(user -> new User(user.getName(), user.getUsername(), user.getPosition()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{role}/addUser")
    public List<User> getRoleNewUsers(@PathVariable String role) {
        return userRepository.findAllNotAssignedUsers(role)
                .stream().map(user -> new User(user.getName(), user.getUsername(), user.getPosition()))
                .collect(Collectors.toList());
    }

    @PostMapping("/{roleName}/addUser/{username}")
    @PreAuthorize("hasRole('Admin')")
    /*    @PreAuthorize("hasPermission('')")*/
    public void addUserToRole(@PathVariable String roleName, @PathVariable String username) {
        Role role = roleRepository.getOne(roleName);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        user.getRoles().add(role);
        userRepository.save(user);
    }
}
