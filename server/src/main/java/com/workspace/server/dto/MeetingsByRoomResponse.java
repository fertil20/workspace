package com.workspace.server.dto;

import com.workspace.server.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;
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
    private Set<User> users;


    public MeetingsByRoomResponse(Long id, String title, LocalDate date, String color, byte timeOfStart, byte timeOfEnd, String organizerName, Set<User> users) {
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
