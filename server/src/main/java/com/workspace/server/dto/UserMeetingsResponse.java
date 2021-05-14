package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class UserMeetingsResponse {
    private Long id;
    private String title;
    private LocalDate date;
    private String color;
    private byte timeOfStart;
    private byte timeOfEnd;
    private String organizerName;
    private Set<MeetingUsersResponse> users;
    private String address;
    private String about;
    private byte maxPeople;


    public UserMeetingsResponse(Long id, String title, LocalDate date, String color, byte timeOfStart, byte timeOfEnd,
                                String organizerName, Set<MeetingUsersResponse> users, String address, String about, byte maxPeople) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.color = color;
        this.timeOfStart = timeOfStart;
        this.timeOfEnd = timeOfEnd;
        this.organizerName = organizerName;
        this.users = users;
        this.address = address;
        this.about = about;
        this.maxPeople = maxPeople;
    }
}
