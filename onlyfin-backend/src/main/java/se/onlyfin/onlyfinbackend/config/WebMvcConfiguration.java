package se.onlyfin.onlyfinbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                // Enable cross-origin request handling for the specified path pattern.
                // Exact path mapping URIs (such as "/admin") are supported as well as Ant-style path patterns (such as "/admin/**").
                .addMapping("/*")
                .allowedOrigins("http://localhost:3000")
                // .allowedOriginPatterns("")
                .allowCredentials(true)
                .allowedHeaders("*")
                .exposedHeaders("*")
                .maxAge(60 *30)
                .allowedMethods("*")
        ;
    }
}
