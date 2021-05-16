package com.workspace.server.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IndexController {

    @GetMapping
    public ModelAndView home() {
        return new ModelAndView("index.html");
    }
}
