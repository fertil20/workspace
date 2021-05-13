package com.workspace.server.dto;

import com.workspace.server.model.User;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MeetingRequest {
    private String title;
    private LocalDate date;
    private String color;
    private byte timeOfStart;
    private byte timeOfEnd;
    private String organizerName;
    private Set<User> users;
}
