package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.FeedCard;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface FeedCardRepository extends JpaRepository<FeedCard, Integer> {
    List<FeedCard> findByAnalystUsername(String name);

    List<FeedCard> findByAnalystUsernameAndPostDateAfterOrderByPostDateDesc(String username, Instant cutoffDate);

    List<FeedCard> findByAnalystUsernameOrderByPostDateDesc(String username);

}
