package com.workspace.server.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class NewsRequest {

    private String title;
    private String topText;
    private String bottomText;
    private MultipartFile multipartImage;
}
