package se.onlyfin.onlyfinbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@SpringBootApplication
public class OnlyFinBackendApplication {

    public static void main(String[] args) {
        //hej hej hej 2 hikejnfdnf
        SpringApplication.run(OnlyFinBackendApplication.class, args);
    }

    @GetMapping("/test")
    @ResponseBody
    public String testMethod() {
        return "Hello world";
    }

}
