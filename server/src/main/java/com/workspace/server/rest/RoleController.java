package com.workspace.server.rest;

import com.workspace.server.exception.ResourceNotFoundException;
import com.workspace.server.model.Role;
import com.workspace.server.model.User;
import com.workspace.server.repository.RoleRepository;
import com.workspace.server.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
@PreAuthorize("hasAuthority('Manage_Roles')")
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

    @PostMapping("/deleteRole/{role}")
    @Transactional
    @PreAuthorize("@customAuthorizationService.canEditRole(#role)")
    public void deleteRole(@PathVariable String role) {
        roleRepository.deleteAssociations(role);
        roleRepository.deleteById(role);
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

    @PostMapping("/{role}/addUser/{username}")
    @PreAuthorize("@customAuthorizationService.canEditRole(#role)")
    public void setUserToRole(@PathVariable String role, @PathVariable String username) {
        Role roleName = roleRepository.getOne(role);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        user.getRoles().add(roleName);
        userRepository.save(user);
    }

    @PostMapping("/{role}/deleteUser/{username}")
    @PreAuthorize("@customAuthorizationService.canEditRole(#role)")
    public void deleteUserFromRole(@PathVariable String role, @PathVariable String username) {
        Role roleName = roleRepository.getOne(role);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        user.getRoles().remove(roleName);
        userRepository.save(user);
    }

    @GetMapping("/{role}/privileges")
    public Set<String> getRolePrivileges(@PathVariable String role) {
        return roleRepository.getOne(role).getPrivileges();
    }

    @PostMapping("/{role}/privileges/edit")
    @PreAuthorize("@customAuthorizationService.canEditRole(#role)")
    public void addPrivilegeToRole(@PathVariable String role, @RequestBody Set<String> privileges) {
        Role roleName = roleRepository.getOne(role);
        roleName.setPrivileges(privileges);
        roleRepository.save(roleName);
    }
}