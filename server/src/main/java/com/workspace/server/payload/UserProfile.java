package com.workspace.server.payload;


import com.workspace.server.model.WorkTime;

import java.util.Date;
import java.time.Instant;
import java.util.Set;

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
    private Date birthday;
    private String secretNote;
    private Set<WorkTime> workTimes;
/*    private Long pollCount;
    private Long voteCount;*/


    public UserProfile(Long id, String username, String name, Instant joinedAt, String email, String phone, String tg,
                       String about, String position, String department, String office, Date birthday, String secretNote, Set<WorkTime> workTimes) {
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
        this.workTimes = workTimes;
/*        this.pollCount = pollCount;
        this.voteCount = voteCount;*/
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTg() {
        return tg;
    }

    public void setTg(String tg) {
        this.tg = tg;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getOffice() {
        return office;
    }

    public void setOffice(String office) {
        this.office = office;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getSecretNote() {
        return secretNote;
    }

    public void setSecretNote(String secretNote) {
        this.secretNote = secretNote;
    }


    public Set<WorkTime> getWorkTimes() {
        return workTimes;
    }

    public void setWorkTimes(Set<WorkTime> workTimes) {
        this.workTimes = workTimes;
    }

/*    public Long getPollCount() {
        return pollCount;
    }

    public void setPollCount(Long pollCount) {
        this.pollCount = pollCount;
    }

    public Long getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(Long voteCount) {
        this.voteCount = voteCount;
    }*/
}
