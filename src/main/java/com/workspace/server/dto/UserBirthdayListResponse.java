package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserBirthdayListResponse {
    private Long id;
    private String username;
    private String name;
    private LocalDate birthday;

    public UserBirthdayListResponse(Long id, String username, String name, LocalDate birthday) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.birthday = birthday;
    }
}
