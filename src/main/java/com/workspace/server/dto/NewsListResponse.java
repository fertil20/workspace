package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class NewsListResponse {

    private Long id;
    private String title;
    private LocalDate date;

    public NewsListResponse(Long id, String title, LocalDate date) {
        this.id = id;
        this.title = title;
        this.date = date;
    }
}
