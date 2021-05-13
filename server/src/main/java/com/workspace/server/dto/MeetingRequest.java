package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MeetingRequest {
    private Set<Long> usersId;
    private String title;
    private LocalDate date;
    private String color;
    private byte timeOfStart;
    private byte timeOfEnd;
    private String organizerName;
}
