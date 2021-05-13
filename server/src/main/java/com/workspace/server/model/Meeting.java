package com.workspace.server.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
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

    @Column(length = 30)
    @NotBlank
    private String title;

    @Column
    @NotBlank
    private LocalDate date;

    @Column(length = 15)
    @NotBlank
    private String color;

    @Column
    @NotBlank
    private byte timeOfStart;

    @Column
    @NotBlank
    private byte timeOfEnd;

    @Column
    @NotBlank
    private String organizerName;

    @ManyToMany(mappedBy = "meetings")
    @EqualsAndHashCode.Exclude
    private Set<User> users;

    @ManyToOne
//    @JoinColumn(name = "rooms_id")
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
