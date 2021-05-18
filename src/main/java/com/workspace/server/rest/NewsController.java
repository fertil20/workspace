package com.workspace.server.rest;

import com.workspace.server.dto.NewsRequest;
import com.workspace.server.model.News;
import com.workspace.server.repository.NewsRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsRepository newsRepository;

    public NewsController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @GetMapping("/see/{id}")
    public News getNews(@PathVariable Long id) {
        return newsRepository.getOne(id);
    }

    @GetMapping(value = "/see/{id}/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public Resource downloadNewsImage(@PathVariable Long id) {
        byte[] image = newsRepository.getOne(id).getPicture();
        return new ByteArrayResource(image);
    }

    @PostMapping("/add")
    public void setNews(@RequestBody NewsRequest newsRequest) throws IOException {
        News news = new News();
        news.setTitle(newsRequest.getTitle());
        news.setTopText(newsRequest.getTopText());
        news.setBottomText(newsRequest.getBottomText());
        news.setPicture(newsRequest.getMultipartImage().getBytes());

        newsRepository.save(news);
    }

    @GetMapping("/see")
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }
}
