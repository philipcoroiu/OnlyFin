package se.onlyfin.onlyfinbackend.DTO;

import se.onlyfin.onlyfinbackend.model.dashboard_entity.Category;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Stock;

import java.time.Instant;
import java.time.LocalDateTime;

public record FeedCardDTO(ProfileDTO posterOfContent, Stock stock, Category category, com.fasterxml.jackson.databind.JsonNode content, LocalDateTime postDate, LocalDateTime updatedAt) {
}
