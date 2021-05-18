package com.workspace.server.dto;

import lombok.Data;

import java.time.*;
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
        return date.atStartOfDay().toInstant(ZoneOffset.UTC)
                .plus(Duration.ofHours(timeOfStart));
    }//todo Адаптировать время под разные часовые пояса
}
