package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.repository.CrudRepository;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Repository mapping for the subscription table.
 */
public interface SubscriptionRepository extends CrudRepository<Subscription, Integer> {
    /**
     * Check if a subscription exists.
     *
     * @param subscriber   id of the subscriber
     * @param subscribedTo id of the subscribed-to user.
     * @return true if the subscription exists, false otherwise
     */
    boolean existsBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);

    /**
     * Find a subscription by subscriber and subscribed-to.
     *
     * @param subscriber   id of the subscriber
     * @param subscribedTo id of the subscribed-to user.
     * @return the subscription if it exists, empty otherwise
     */
    Optional<Subscription> findBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);

    /**
     * Finds all subscriptions for a target user
     *
     * @param subscriber the target user
     * @return List of all subscriptions for the target user
     */
    List<Subscription> findBySubscriber(User subscriber);

    /**
     * Finds all subscribers for a target user
     *
     * @param targetUser the target user
     * @return List of all subscribers for the target user
     */
    List<Subscription> findBySubscribedTo(User targetUser);

    Integer countAllBySubscribedTo(User targetUser);

}
