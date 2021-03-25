package com.workspace.server.rest;

import com.workspace.server.dto.UserData;
import com.workspace.server.repository.User;
import com.workspace.server.repository.UserRepository;
import com.workspace.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("users")
    public List<User> getUser() {
        return this.userRepository.findAll();
    }

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/{id}")
    public UserData getUserData(@PathVariable Long id) {
        return userService.getUserData(id);
    }

}
