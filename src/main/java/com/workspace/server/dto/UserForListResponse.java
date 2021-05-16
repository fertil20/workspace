package com.workspace.server.dto;

import lombok.Data;

@Data
public class UserForListResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String phone;
    private String tg;
    private String position;
    private String department;
    private char status;


    public UserForListResponse(Long id, String username, String name, String email, String phone, String tg,
                               String position, String department, char status) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.tg = tg;
        this.position = position;
        this.department = department;
        this.status = status;
    }
}
