package com.workspace.server.dto;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Instant;

@Data
public class UserProfile {
    private Long id;
    private String username;
    private String name;
    private Instant joinedAt;
    private String email;
    private String phone;
    private String tg;
    private String about;
    private String position;
    private String department;
    private String office;
    private LocalDate birthday;
    private String secretNote;
    private char status;
    private LocalTime startAt;
    private LocalTime endAt;
/*    private Long pollCount;
    private Long voteCount;*/


    public UserProfile(Long id, String username, String name, Instant joinedAt, String email, String phone, String tg,
                       String about, String position, String department, String office, LocalDate birthday, String secretNote, char status, LocalTime startAt, LocalTime endAt) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.joinedAt = joinedAt;
        this.email = email;
        this.phone = phone;
        this.tg = tg;
        this.about = about;
        this.position = position;
        this.department = department;
        this.office = office;
        this.birthday = birthday;
        this.secretNote = secretNote;
        this.status = status;
        this.startAt = startAt;
        this.endAt = endAt;
/*        this.workTimes = workTimes;*/
/*        this.pollCount = pollCount;
        this.voteCount = voteCount;*/
    }
}
