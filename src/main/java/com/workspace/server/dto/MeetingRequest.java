package com.workspace.server.dto;

import lombok.Data;

import java.time.*;
import java.util.Set;

@Data
public class MeetingRequest {
    private Set<Long> usersId;
    private String title;
    private String color;
    private Instant timeOfStart;
    private Instant timeOfEnd;
    private String organizerName;
}
