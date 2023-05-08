package se.onlyfin.onlyfinbackend.controller;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.ProfileDTO;
import se.onlyfin.onlyfinbackend.model.OnlyfinUserPrincipal;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.SubscriptionRepository;
import se.onlyfin.onlyfinbackend.service.UserService;

import java.time.Instant;
import java.util.*;

/**
 * This class is responsible for handling requests related to subscriptions.
 */
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@RestController
public class SubscriptionController {
    private final SubscriptionRepository subscriptionRepository;
    private final DashboardController dashboardController;
    private final UserService userService;

    @Autowired
    public SubscriptionController(SubscriptionRepository subscriptionRepository,
                                  DashboardController dashboardController, UserService userService) {
        this.subscriptionRepository = subscriptionRepository;
        this.dashboardController = dashboardController;
        this.userService = userService;
    }

    /**
     * Adds a subscription from the logged-in user to the user with the given ID.
     *
     * @param principal the logged-in user
     * @param username  the username of the user to subscribe to
     * @return response entity with the username of the subscribed-to user if successful
     */
    @PostMapping("/subscribe")
    public ResponseEntity<String> addSubscription(@RequestParam("username") String username, @AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User subscribingUser = principal.getUser();

        User userToSubscribeTo = userService.getUserOrNull(username);
        if (userToSubscribeTo == null) {
            return ResponseEntity.notFound().build();
        }

        if (isUserSubscribedToThisUser(subscribingUser, userToSubscribeTo)) {
            return ResponseEntity.badRequest().body("Already subscribed");
        }

        Subscription subscription = new Subscription();
        subscription.setSubscriber(subscribingUser);
        subscription.setSubscribedTo(userToSubscribeTo);
        subscriptionRepository.save(subscription);

        return ResponseEntity.ok().body(userToSubscribeTo.getUsername());
    }

    /**
     * Removes specified subscription from the logged-in user.
     *
     * @param principal the logged-in user
     * @param username  the username of the user to unsubscribe from
     * @return response entity with the username of the unsubscribed-from user if successful
     */
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<String> removeSubscription(@RequestParam("username") String username, @AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User userWantingToUnsubscribe = principal.getUser();

        User userToUnsubscribeFrom = userService.getUserOrNull(username);
        if (userToUnsubscribeFrom == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<Subscription> subscriptionOptional =
                subscriptionRepository.findBySubscriberAndSubscribedTo(userWantingToUnsubscribe, userToUnsubscribeFrom);
        if (subscriptionOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Subscription targetSubscription = subscriptionOptional.get();

        subscriptionRepository.delete(targetSubscription);

        return ResponseEntity.ok().body(userToUnsubscribeFrom.getUsername());
    }

    /**
     * Fetches the logged-in user's subscriptions as profiles
     *
     * @param principal the logged-in user
     * @return profile list containing the user's subscriptions
     */
    @GetMapping("/fetch-current-user-subscriptions")
    public ResponseEntity<List<ProfileDTO>> fetchCurrentUserSubscriptions(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        List<ProfileDTO> profiles = getCurrentUserSubscriptions(principal);

        return ResponseEntity.ok().body(profiles);
    }

    /**
     * Generates a subscription list sorted by the latest post date of all the analyst posts
     *
     * @param principal the logged-in user
     * @return postdate-sorted analyst profile list
     */
    @GetMapping("/user-subscription-list-sorted-by-postdate")
    public ResponseEntity<List<ProfileDTO>> generateUserSubscriptionListByPostDate(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User fetchingUser = principal.getUser();

        List<Subscription> subscriptions = new ArrayList<>(subscriptionRepository.findBySubscriber(fetchingUser));
        if (subscriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<User> subscribedToAnalysts = new ArrayList<>();
        for (Subscription currentSubscription : subscriptions) {
            subscribedToAnalysts.add(currentSubscription.getSubscribedTo());
        }

        //we want the latest poster at the top, therefore, reverse order is used(default is ascending order)
        TreeMap<Instant, User> analystsLastPostTime = new TreeMap<>(Collections.reverseOrder());
        for (User currentAnalyst : subscribedToAnalysts) {
            analystsLastPostTime.put(dashboardController.fetchAnalystsLastPostTime(currentAnalyst), currentAnalyst);
        }
        List<ProfileDTO> profiles = craftProfileListFromInstantAndUserTreemap(analystsLastPostTime);

        return ResponseEntity.ok().body(profiles);
    }

    /**
     * Generates a subscription list sorted by the latest update date of all the analyst posts
     *
     * @param principal the logged-in user
     * @return updated-date-sorted analyst profile list
     */
    @GetMapping("/user-subscription-list-sorted-by-update-date")
    public ResponseEntity<List<ProfileDTO>> generateUserSubscriptionListByUpdateDate(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User fetchingUser = principal.getUser();

        List<Subscription> subscriptions = new ArrayList<>(subscriptionRepository.findBySubscriber(fetchingUser));
        if (subscriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<User> subscribedToAnalysts = new ArrayList<>();
        for (Subscription currentSubscription : subscriptions) {
            subscribedToAnalysts.add(currentSubscription.getSubscribedTo());
        }

        //we want the latest poster at the top, therefore, reverse order is used(default is ascending order)
        TreeMap<Instant, User> analystsLastUpdateTime = new TreeMap<>(Collections.reverseOrder());
        for (User currentAnalyst : subscribedToAnalysts) {
            analystsLastUpdateTime.put(dashboardController.fetchAnalystsLastUpdateTime(currentAnalyst), currentAnalyst);
        }
        List<ProfileDTO> profiles = craftProfileListFromInstantAndUserTreemap(analystsLastUpdateTime);

        return ResponseEntity.ok().body(profiles);
    }

    /**
     * Fetches the subscription count for the logged-in user
     *
     * @param principal the logged-in user
     * @return the subscription count for the logged-in user
     */
    @GetMapping("/subscriptions/get-my-subscribe-count")
    public ResponseEntity<Integer> fetchSubCountForPrincipal(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User targetUser = principal.getUser();

        Integer subscriptionCount = subscriptionRepository.countAllBySubscribedTo(targetUser);

        return ResponseEntity.ok().body(subscriptionCount);
    }

    /**
     * Fetches the subscription count for the target user
     *
     * @param targetUsername the username of the target user
     * @return the subscription count for the target user
     */
    @GetMapping("/subscriptions/get-subscribe-count")
    public ResponseEntity<Integer> fetchSubCountForTarget(@RequestParam String targetUsername) {
        User targetUser = userService.getUserOrNull(targetUsername);
        if (targetUser == null) {
            return ResponseEntity.badRequest().build();
        }

        Integer subscriptionCount = subscriptionRepository.countAllBySubscribedTo(targetUser);

        return ResponseEntity.ok().body(subscriptionCount);
    }

    /**
     * Helper method to craft a profile list from a treemap of instants and users
     *
     * @param analystsLastUpdateTime the treemap of instants and users
     * @return a profile list in the same order as the treemap
     */
    private List<ProfileDTO> craftProfileListFromInstantAndUserTreemap(TreeMap<Instant, User> analystsLastUpdateTime) {
        List<User> sortedUserList = new ArrayList<>(analystsLastUpdateTime.values());

        List<ProfileDTO> profileDTOList = new ArrayList<>();
        sortedUserList.forEach((currentUser) -> profileDTOList.add(
                new ProfileDTO(currentUser.getUsername(), currentUser.getId())));
        return profileDTOList;
    }

    /**
     * Checks if a user is subscribed to another
     *
     * @param subscriber   the target subscribing user
     * @param subscribedTo the target subscribed-to user
     * @return if the user is subscribed
     */
    public boolean isUserSubscribedToThisUser(User subscriber, User subscribedTo) {
        return subscriptionRepository.existsBySubscriberAndSubscribedTo(subscriber, subscribedTo);
    }

    public List<ProfileDTO> getCurrentUserSubscriptions(@NonNull OnlyfinUserPrincipal principal) {
        User userToFetchSubscriptionsFrom = principal.getUser();

        List<Subscription> subscriptions = subscriptionRepository.findBySubscriber(userToFetchSubscriptionsFrom);
        return getProfilesFromSubscriptions(subscriptions);
    }

    private List<ProfileDTO> getProfilesFromSubscriptions(List<Subscription> subscriptions) {
        List<ProfileDTO> profiles = new ArrayList<>();
        subscriptions.forEach((currentSubscription) -> profiles.add(new ProfileDTO(
                currentSubscription.getSubscribedTo().getUsername(),
                currentSubscription.getSubscribedTo().getId()))
        );
        return profiles;
    }

}
