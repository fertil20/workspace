package com.workspace.server.dto;


import lombok.Data;


@Data
public class ProfileEditRequest {
    private String name;
    private String email;
    private String phone;
    private String tg;
    private String about;
    private String position;
    private String department;
    private String office;
    private String secretNote;
    private char status;
/*    private Set<WorkTime> workTimes;*/
}
