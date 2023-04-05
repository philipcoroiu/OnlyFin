package se.onlyfin.onlyfinbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.SubscriptionRepository;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import java.security.Principal;
import java.util.Objects;
import java.util.Optional;

@RestController
public class SubscriptionController {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionController(UserRepository userRepository, SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> addSubscription(Principal principal, @RequestParam("subscriberId") Integer subscriberId, @RequestParam("subscribedToId") Integer subscribedToId) {

        User subscriber = userRepository.findById(subscriberId).orElseThrow(() -> new UsernameNotFoundException("Subscriber not found with ID " + subscriberId));
        //check that authenticated user is not changing other users' subscriptions
        if (!Objects.equals(subscriber.getUsername(), principal.getName())) {
            return ResponseEntity.badRequest().build();
        }
        User subscribedTo = userRepository.findById(subscribedToId).orElseThrow(() -> new UsernameNotFoundException("Subscribed-to user not found with ID " + subscribedToId));

        if (subscriptionRepository.existsBySubscriberAndSubscribedTo(subscriber, subscribedTo)) {
            return ResponseEntity.badRequest().body("Already subscribed");
        }

        Subscription subscription = new Subscription();
        subscription.setSubscriber(subscriber);
        subscription.setSubscribedTo(subscribedTo);

        subscriptionRepository.save(subscription);

        return ResponseEntity.ok().body("Now subscribed to: " + subscribedTo.getUsername());
    }

    @DeleteMapping("/unsubscribe")
    public ResponseEntity<String> removeSubscription(Principal principal, @RequestParam("subscriberId") Integer subscriberId, @RequestParam("subscribedToId") Integer subscribedToId) {

        User subscriber = userRepository.findById(subscriberId).orElseThrow(() -> new UsernameNotFoundException("Subscriber not found with ID " + subscriberId));
        //check that authenticated user is not changing other users' subscriptions
        if (!Objects.equals(subscriber.getUsername(), principal.getName())) {
            return ResponseEntity.badRequest().build();
        }
        User subscribedTo = userRepository.findById(subscribedToId).orElseThrow(() -> new UsernameNotFoundException("Subscribed-to user not found with ID " + subscribedToId));

        Optional<Subscription> subscriptionOptional = subscriptionRepository.findBySubscriberAndSubscribedTo(subscriber, subscribedTo);

        if (subscriptionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        subscriptionRepository.delete(subscriptionOptional.get());

        return ResponseEntity.ok().body("Now unsubscribed from: " + subscribedTo.getUsername());
    }

}
