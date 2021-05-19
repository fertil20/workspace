package com.workspace.server.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "news")
public class News {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", length = 40, nullable=false)
    private String title;

    @Column(name = "date", nullable=false)
    private LocalDate date = LocalDate.now();

    @Column(name = "top_text", length = 400)
    private String topText;

    @Column(name = "bottom_text", length = 400)
    private String bottomText;

    @Column(name = "picture")
    @Lob
    byte[] picture = "Нет картинки".getBytes(StandardCharsets.UTF_8);
}
