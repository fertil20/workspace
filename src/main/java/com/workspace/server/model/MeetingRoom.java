package com.workspace.server.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@Table(name = "rooms")
public class MeetingRoom {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable=false)
    private String address;

    @Column(length = 300)
    private String about;

    @Column(nullable=false)
    private byte maxPeople;

    @OneToMany (mappedBy = "meetingRoom")
    @EqualsAndHashCode.Exclude
    private Set<Meeting> meetings;

/*    public MeetingRoom(Long id) {
        this.id = id;
    }

    public MeetingRoom(Set<User> users) {
        this.users = users;
    }*/
}