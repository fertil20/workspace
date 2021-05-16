package com.workspace.server.dto;

import lombok.Data;

@Data
public class MeetingRoomResponse {
    private Long id;
    private String address;
    private String about;
    private byte maxPeople;

    public MeetingRoomResponse(Long id, String address, String about, byte maxPeople) {
        this.id = id;
        this.address = address;
        this.about = about;
        this.maxPeople = maxPeople;
    }
}
