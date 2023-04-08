package se.onlyfin.onlyfinbackend.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import se.onlyfin.onlyfinbackend.model.dashboard.Category;

@Configuration
public class JacksonConfig {
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer addCustomBigDecimalDeserialization() {
        return builder -> builder.mixIn(Category.class, CategoryMixin.class);
    }

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    abstract class CategoryMixin {
    }
}
