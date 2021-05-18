package com.workspace.server.rest;

import com.workspace.server.dto.NewsListResponse;
import com.workspace.server.dto.NewsRequest;
import com.workspace.server.dto.NewsResponse;
import com.workspace.server.model.News;
import com.workspace.server.repository.NewsRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsRepository newsRepository;

    public NewsController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @GetMapping("/see/{id}")
    public Optional<NewsResponse> getNews(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(news -> new NewsResponse(
                        news.getId(),
                        news.getTitle(),
                        news.getDate(),
                        news.getTopText(),
                        news.getBottomText()));
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
    public Set<NewsResponse> getAllNews() {
        return newsRepository.findAll().stream()
                .map(news -> new NewsResponse(
                        news.getId(),
                        news.getTitle(),
                        news.getDate(),
                        news.getTopText(),
                        news.getBottomText()))
                .collect(Collectors.toSet());
    }

    @GetMapping("/list")
    public Set<NewsListResponse> getListNews() {
        return newsRepository.findAll().stream()
                .map(news -> new NewsListResponse(
                        news.getId(),
                        news.getTitle(),
                        news.getDate()))
                .collect(Collectors.toSet());
    }
}
