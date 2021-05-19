package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class MeetingRequest {
    private Set<Long> usersId;
    private String title;
    private String color;
    private LocalDateTime timeOfStart;
    private LocalDateTime timeOfEnd;
    private String organizerName;
}