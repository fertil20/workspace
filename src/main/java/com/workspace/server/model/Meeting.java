package com.workspace.server.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name = "meetings")
public class Meeting {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60, nullable=false)
    private String title;

    @Column(name = "date", nullable=false)
    private LocalDate date;

    @Column(length = 15, nullable=false)
    private String color;

    @Column(nullable=false)
    private byte timeOfStart;

    @Column(nullable=false)
    private byte timeOfEnd;

    @Column(nullable=false)
    private String organizerName;
/*
    @Column(nullable = false)
    private Instant meetingDateTime todo полностью передать время*/

    @ManyToMany
    @JoinTable(name = "meetings_users",
            joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @EqualsAndHashCode.Exclude
    private Set<User> users;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    private MeetingRoom meetingRoom;

    public Meeting(Long id) {
        this.id = id;
    }

    public Meeting(Set<User> users) {
        this.users = users;
    }

    public Meeting(MeetingRoom meetingRoom) {
        this.meetingRoom = meetingRoom;
    }
}
