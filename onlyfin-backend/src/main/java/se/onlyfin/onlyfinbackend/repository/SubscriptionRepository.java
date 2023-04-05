package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.repository.CrudRepository;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;

import java.util.Optional;

public interface SubscriptionRepository extends CrudRepository<Subscription, Integer> {
    boolean existsBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);

    Optional<Subscription> findBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);
}
