package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class MeetingsByRoomResponse {
    private Long id;
    private String title;
    private String color;
    private LocalDateTime timeOfStart;
    private LocalDateTime timeOfEnd;
    private String organizerName;
    private Set<MeetingUsersResponse> users;


    public MeetingsByRoomResponse(Long id, String title, String color, LocalDateTime timeOfStart, LocalDateTime timeOfEnd, String organizerName, Set<MeetingUsersResponse> users) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.timeOfStart = timeOfStart;
        this.timeOfEnd = timeOfEnd;
        this.organizerName = organizerName;
        this.users = users;
    }
}
