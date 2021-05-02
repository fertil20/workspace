package com.workspace.server.service;

import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class CustomAuthorizationService {

    private static final Set<String> NOT_EDITABLE_ROLES = Set.of("Пользователь", "Администратор");

    public boolean canEditRole(String role) {
        return !NOT_EDITABLE_ROLES.contains(role);
    }
}
