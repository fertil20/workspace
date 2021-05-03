package com.workspace.server.dto;

import java.util.Set;

public class UserSummary {
    private Long id;
    private String username;
    private String name;
    private Set<String> privileges;

    public UserSummary(Long id, String username, String name, Set<String> privileges) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.privileges = privileges;
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

    public Set<String> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(Set<String> privileges) {
        this.privileges = privileges;
    }
}
