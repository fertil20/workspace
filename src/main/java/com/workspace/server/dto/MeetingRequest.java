package com.workspace.server.dto;

import lombok.Data;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
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

    public Instant getInstant() {
        return date.atStartOfDay(ZoneId.systemDefault())
                .plus(Duration.ofHours(timeOfStart)).toInstant();
    }
}