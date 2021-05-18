package com.workspace.server.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class NewsRequest {

    private String title;
    private String topText;
    private String bottomText;
    private MultipartFile multipartImage;

    public NewsRequest(String title, String topText, String bottomText, MultipartFile multipartImage) {
        this.title = title;
        this.topText = topText;
        this.bottomText = bottomText;
        this.multipartImage = multipartImage;
    }
}
