package com.workspace.server.dto;

import lombok.Data;

@Data
public class MeetingUsersResponse {
    private Long id;
    private String name;

    public MeetingUsersResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
