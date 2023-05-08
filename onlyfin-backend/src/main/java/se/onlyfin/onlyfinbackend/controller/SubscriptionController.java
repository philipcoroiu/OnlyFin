package se.onlyfin.onlyfinbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.ProfileDTO;
import se.onlyfin.onlyfinbackend.model.OnlyfinUserPrincipal;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.SubscriptionRepository;
import se.onlyfin.onlyfinbackend.service.UserService;

import java.security.Principal;
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
    public ResponseEntity<String> addSubscription(Principal principal, @RequestParam("username") String username) {
        User userWantingToSubscribe = userService.getUserOrException(principal.getName());

        //check that authenticated user is not changing other users' subscriptions
        if (!Objects.equals(userWantingToSubscribe.getUsername(), principal.getName())) {
            return ResponseEntity.badRequest().build();
        }

        User userToSubscribeTo = userService.getUserOrException(username);

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
     * @param principal the logged-in user
     * @param username  the username of the user to unsubscribe from
     * @return response entity with the username of the unsubscribed-from user if successful
     */
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<String> removeSubscription(Principal principal, @RequestParam("username") String username) {
        User userWantingToUnsubscribe = userService.getUserOrException(principal.getName());

        User userToUnsubscribeFrom = userService.getUserOrException(username);

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
    public ResponseEntity<List<ProfileDTO>> fetchCurrentUserSubscriptions(Principal principal) {
        User userToFetchSubscriptionsFrom = userService.getUserOrNull(principal.getName());
        if (userToFetchSubscriptionsFrom == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Subscription> subscriptionList = subscriptionRepository.findBySubscriber(userToFetchSubscriptionsFrom);
        List<ProfileDTO> subscriptionsDTOList = new ArrayList<>();
        subscriptionList.forEach((currentSubscription) -> subscriptionsDTOList.add(new ProfileDTO(
                currentSubscription.getSubscribedTo().getUsername(),
                currentSubscription.getSubscribedTo().getId()))
        );

        return ResponseEntity.ok().body(subscriptionsDTOList);
    }

    /**
     * Generates a subscription list sorted by the latest post date of all the analyst posts
     *
     * @param principal the logged-in user
     * @return postdate-sorted analyst profile list
     */
    @GetMapping("/user-subscription-list-sorted-by-postdate")
    public ResponseEntity<List<ProfileDTO>> generateUserSubscriptionListByPostDate(Principal principal) {
        User userToFetchSubListFor = userService.getUserOrException(principal.getName());

        List<Subscription> subscriptionList =
                new ArrayList<>(subscriptionRepository.findBySubscriber(userToFetchSubListFor));
        if (subscriptionList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<User> subscribedToAnalysts = new ArrayList<>();
        for (Subscription currentSubscription : subscriptionList) {
            subscribedToAnalysts.add(currentSubscription.getSubscribedTo());
        }

        //we want the latest poster at the top, therefore, reverse order is used(default is ascending order)
        TreeMap<Instant, User> analystsLastPostTime = new TreeMap<>(Collections.reverseOrder());
        for (User currentAnalyst : subscribedToAnalysts) {
            analystsLastPostTime.put(dashboardController.fetchAnalystsLastPostTime(currentAnalyst), currentAnalyst);
        }
        List<ProfileDTO> profileDTOList = craftProfileListFromInstantAndUserTreemap(analystsLastPostTime);

        return ResponseEntity.ok().body(profileDTOList);
    }

    /**
     * Generates a subscription list sorted by the latest update date of all the analyst posts
     *
     * @param principal the logged-in user
     * @return updated-date-sorted analyst profile list
     */
    @GetMapping("/user-subscription-list-sorted-by-update-date")
    public ResponseEntity<List<ProfileDTO>> generateUserSubscriptionListByUpdateDate(Principal principal) {
        User userToFetchSubListFor = userService.getUserOrException(principal.getName());

        List<Subscription> subscriptionList =
                new ArrayList<>(subscriptionRepository.findBySubscriber(userToFetchSubListFor));
        if (subscriptionList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<User> subscribedToAnalysts = new ArrayList<>();
        for (Subscription currentSubscription : subscriptionList) {
            subscribedToAnalysts.add(currentSubscription.getSubscribedTo());
        }

        //we want the latest poster at the top, therefore, reverse order is used(default is ascending order)
        TreeMap<Instant, User> analystsLastUpdateTime = new TreeMap<>(Collections.reverseOrder());
        for (User currentAnalyst : subscribedToAnalysts) {
            analystsLastUpdateTime.put(dashboardController.fetchAnalystsLastUpdateTime(currentAnalyst), currentAnalyst);
        }
        List<ProfileDTO> profileDTOList = craftProfileListFromInstantAndUserTreemap(analystsLastUpdateTime);

        return ResponseEntity.ok().body(profileDTOList);
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

}
