package com.workspace.server.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class NewsResponse {
    private Long id;
    private String title;
    private LocalDate date;
    private String topText;
    private String bottomText;

    public NewsResponse(Long id, String title, LocalDate date, String topText, String bottomText) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.topText = topText;
        this.bottomText = bottomText;
    }
}
