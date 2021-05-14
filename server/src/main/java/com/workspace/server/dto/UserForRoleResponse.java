package com.workspace.server.dto;

import lombok.Data;

@Data
public class UserForRoleResponse {
    private String name;
    private String username;
    private String position;

    public UserForRoleResponse(String name, String username, String position) {
        this.name = name;
        this.username = username;
        this.position = position;
    }
}
