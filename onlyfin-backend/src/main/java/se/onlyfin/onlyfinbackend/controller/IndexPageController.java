package se.onlyfin.onlyfinbackend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class IndexPageController {

    @GetMapping("")
    public String indexPage() {
        return "index.html";
    }

}
