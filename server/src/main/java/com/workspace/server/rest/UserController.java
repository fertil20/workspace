package com.workspace.server.rest;

import com.workspace.server.dto.UserData;
import com.workspace.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/{id}")
    public UserData getUserData(@PathVariable Long id) {
        return userService.getUserData(id);
    }
}