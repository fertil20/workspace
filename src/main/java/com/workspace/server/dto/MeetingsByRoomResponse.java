package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MeetingsByRoomResponse {
    private Long id;
    private String title;
    private LocalDate date;
    private String color;
    private byte timeOfStart;
    private byte timeOfEnd;
    private String organizerName;
    private Set<MeetingUsersResponse> users;


    public MeetingsByRoomResponse(Long id, String title, LocalDate date, String color, byte timeOfStart, byte timeOfEnd, String organizerName, Set<MeetingUsersResponse> users) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.color = color;
        this.timeOfStart = timeOfStart;
        this.timeOfEnd = timeOfEnd;
        this.organizerName = organizerName;
        this.users = users;
    }
}
