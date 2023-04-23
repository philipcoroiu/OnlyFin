package se.onlyfin.onlyfinbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.ProfileDTO;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.SubscriptionRepository;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * This class is responsible for handling requests related to subscriptions.
 */
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@RestController
public class SubscriptionController {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    public SubscriptionController(UserRepository userRepository, SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Adds a subscription from the logged-in user to the user with the given ID.
     *
     * @param principal     the logged-in user
     * @param username the username of the user to subscribe to
     * @return response entity with the username of the subscribed-to user if successful
     */
    @PostMapping("/subscribe")
    public ResponseEntity<String> addSubscription(Principal principal, @RequestParam("username") String username) {
        User userWantingToSubscribe =
                userRepository.findByUsername(principal.getName()).orElseThrow(() ->
                        new UsernameNotFoundException("Logged in user not present in db"));

        //check that authenticated user is not changing other users' subscriptions
        if (!Objects.equals(userWantingToSubscribe.getUsername(), principal.getName())) {
            return ResponseEntity.badRequest().build();
        }

        User userToSubscribeTo = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Subscribe-to user not found with ID " + username));

        if (subscriptionRepository.existsBySubscriberAndSubscribedTo(userWantingToSubscribe, userToSubscribeTo)) {
            return ResponseEntity.badRequest().body("Already subscribed");
        }

        Subscription subscription = new Subscription();
        subscription.setSubscriber(userWantingToSubscribe);
        subscription.setSubscribedTo(userToSubscribeTo);

        subscriptionRepository.save(subscription);

        return ResponseEntity.ok().body(userToSubscribeTo.getUsername());
    }

    /**
     * Removes specified subscription from the logged-in user.
     *
     * @param principal      the logged-in user
     * @param username the username of the user to unsubscribe from
     * @return response entity with the username of the unsubscribed-from user if successful
     */
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<String> removeSubscription(Principal principal, @RequestParam("username") String username) {

        User userWantingToUnsubscribe = userRepository.findByUsername(principal.getName()).orElseThrow(() ->
                new UsernameNotFoundException("Logged in user not present in db"));

        //check that authenticated user is not changing other users' subscriptions
        if (!Objects.equals(userWantingToUnsubscribe.getUsername(), principal.getName())) {
            return ResponseEntity.badRequest().build();
        }

        User userToUnsubscribeFrom = userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Subscribed-to user not found with ID " + username));

        Optional<Subscription> subscriptionOptional =
                subscriptionRepository.findBySubscriberAndSubscribedTo(userWantingToUnsubscribe, userToUnsubscribeFrom);

        if (subscriptionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        subscriptionRepository.delete(subscriptionOptional.get());

        return ResponseEntity.ok().body(userToUnsubscribeFrom.getUsername());
    }

    @GetMapping("/fetch-current-user-subscriptions")
    public ResponseEntity<List<ProfileDTO>> fetchCurrentUserSubscriptions(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        User userToFetchSubscriptionsFrom = userOptional.get();

        List<Subscription> subscriptionList = subscriptionRepository.findBySubscriber(userToFetchSubscriptionsFrom);
        List<ProfileDTO> subscriptionsDTOList = new ArrayList<>();
        subscriptionList.forEach((currentSubscription) -> subscriptionsDTOList.add(new ProfileDTO(
                currentSubscription.getSubscribedTo().getUsername(),
                currentSubscription.getSubscribedTo().getId()))
        );

        return ResponseEntity.ok().body(subscriptionsDTOList);
    }

    public boolean isUserSubscribedToThisUser(User subscriber, User subscribedTo) {
        return subscriptionRepository.existsBySubscriberAndSubscribedTo(subscriber, subscribedTo);
    }

}
