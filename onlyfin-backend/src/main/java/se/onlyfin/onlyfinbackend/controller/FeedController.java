package se.onlyfin.onlyfinbackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.onlyfin.onlyfinbackend.DTO.FeedCardDTO;
import se.onlyfin.onlyfinbackend.DTO.ProfileDTO;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Category;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Dashboard;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.ModuleEntity;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Stock;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/feed")
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
public class FeedController {
    private final DashboardController dashboardController;
    private final UserRepository userRepository;

    public FeedController(DashboardController dashboardController, UserRepository userRepository) {
        this.dashboardController = dashboardController;
        this.userRepository = userRepository;
    }

    /**
     * This method fetches all the feed cards for the user that is logged in.
     *
     * @param principal the user that is logged in
     * @return a list of feed cards
     */
    @GetMapping("/all-the-things")
    public ResponseEntity<List<FeedCardDTO>> fetchAllTheFeed(Principal principal) {
        //check that user exists
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        //check that user has subscriptions
        User userToFetchFeedFor = userOptional.get();
        if (userToFetchFeedFor.getSubscriptions().size() < 1) {
            return ResponseEntity.badRequest().build();
        }
        //grab their subscriptions
        List<Subscription> subscriptionList = new ArrayList<>(userToFetchFeedFor.getSubscriptions());
        //assemble a map of dashboards for the subscribed-to analysts so that a dashboard can be linked to analyst
        HashMap<User, Dashboard> dashboardOwnershipMap = new HashMap<>();
        for (Subscription currentSubscription : subscriptionList) {
            User ownerOfDashboard = userRepository.findById(currentSubscription.getSubscribedTo().getId()).orElseThrow();
            Dashboard ownersDashboard = dashboardController.getDashboard(currentSubscription.getSubscribedTo().getId().toString()).getBody();
            dashboardOwnershipMap.put(ownerOfDashboard, ownersDashboard);
        }

        List<FeedCardDTO> feedCardDTOS = new ArrayList<>();
        for (User currentAnalyst : dashboardOwnershipMap.keySet()) {
            //dashboard of currentAnalyst
            Dashboard currentDashboard = dashboardOwnershipMap.get(currentAnalyst);
            //profile representation of currentAnalyst
            ProfileDTO profileDTOForCurrentDashboard = new ProfileDTO(currentAnalyst.getUsername(), currentAnalyst.getId());
            //stocks that currentAnalyst covers
            List<Stock> stocksCoveredByCurrentAnalyst = new ArrayList<>(currentDashboard.getStocks());
            //go through stocks that currentAnalyst covers
            for (Stock currentStockThatCurrentAnalystCovers : stocksCoveredByCurrentAnalyst) {
                //categories under current stock that currentAnalyst covers
                for (Category categoryUnderCurrentStockThatCurrentAnalystCovers : currentStockThatCurrentAnalystCovers.getCategories()) {
                    //current module under the current stock category
                    for (ModuleEntity moduleEntityUnderCurrentStockThatCurrentAnalystCovers : categoryUnderCurrentStockThatCurrentAnalystCovers.getModuleEntities()) {
                        JsonNode content = moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getContent();
                        feedCardDTOS.add(new FeedCardDTO(
                                profileDTOForCurrentDashboard,
                                currentStockThatCurrentAnalystCovers,
                                categoryUnderCurrentStockThatCurrentAnalystCovers,
                                content,
                                LocalDateTime.ofInstant(moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getPostDate(), ZoneId.systemDefault()),
                                LocalDateTime.ofInstant(moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getUpdatedDate(), ZoneId.systemDefault())));
                    }
                }
            }

        }
        //sort all the things so that the newest content is first(that's why reversed is used)
        feedCardDTOS.sort(Comparator.comparing(FeedCardDTO::postDate).reversed());

        return ResponseEntity.ok().body(feedCardDTOS);
    }

    /**
     * This method fetches feed cards from the last 7 days for the user that is logged in.
     *
     * @param principal the user that is logged in
     * @return a list of feed cards from the last 7 days
     */
    @GetMapping("/week")
    public ResponseEntity<List<FeedCardDTO>> fetchWeeklyFeed(Principal principal) {
        //check that user exists
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        //check that user has subscriptions
        User userToFetchFeedFor = userOptional.get();
        if (userToFetchFeedFor.getSubscriptions().size() < 1) {
            return ResponseEntity.badRequest().build();
        }
        //grab their subscriptions
        List<Subscription> subscriptionList = new ArrayList<>(userToFetchFeedFor.getSubscriptions());
        //assemble a map of dashboards for the subscribed-to analysts so that a dashboard can be linked to analyst
        HashMap<User, Dashboard> dashboardOwnershipMap = new HashMap<>();
        for (Subscription currentSubscription : subscriptionList) {
            User ownerOfDashboard = userRepository.findById(currentSubscription.getSubscribedTo().getId()).orElseThrow();
            Dashboard ownersDashboard = dashboardController.getDashboard(currentSubscription.getSubscribedTo().getId().toString()).getBody();
            dashboardOwnershipMap.put(ownerOfDashboard, ownersDashboard);
        }

        List<FeedCardDTO> feedCardDTOS = new ArrayList<>();
        for (User currentAnalyst : dashboardOwnershipMap.keySet()) {
            //dashboard of currentAnalyst
            Dashboard currentDashboard = dashboardOwnershipMap.get(currentAnalyst);
            //profile representation of currentAnalyst
            ProfileDTO profileDTOForCurrentDashboard = new ProfileDTO(currentAnalyst.getUsername(), currentAnalyst.getId());
            //stocks that currentAnalyst covers
            List<Stock> stocksCoveredByCurrentAnalyst = new ArrayList<>(currentDashboard.getStocks());
            //go through stocks that currentAnalyst covers
            for (Stock currentStockThatCurrentAnalystCovers : stocksCoveredByCurrentAnalyst) {
                //categories under current stock that currentAnalyst covers
                for (Category categoryUnderCurrentStockThatCurrentAnalystCovers : currentStockThatCurrentAnalystCovers.getCategories()) {
                    //current module under the current stock category
                    for (ModuleEntity moduleEntityUnderCurrentStockThatCurrentAnalystCovers : categoryUnderCurrentStockThatCurrentAnalystCovers.getModuleEntities()) {
                        if (moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getPostDate().isAfter(Instant.now().minus(7, ChronoUnit.DAYS))) {
                            JsonNode content = moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getContent();
                            feedCardDTOS.add(new FeedCardDTO(
                                    profileDTOForCurrentDashboard,
                                    currentStockThatCurrentAnalystCovers,
                                    categoryUnderCurrentStockThatCurrentAnalystCovers,
                                    content,
                                    LocalDateTime.ofInstant(moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getPostDate(), ZoneId.systemDefault()),
                                    LocalDateTime.ofInstant(moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getUpdatedDate(), ZoneId.systemDefault())));
                        }
                    }
                }
            }

        }
        //sort all the things so that the newest content is first(that's why reversed is used)
        feedCardDTOS.sort(Comparator.comparing(FeedCardDTO::postDate).reversed());

        return ResponseEntity.ok().body(feedCardDTOS);
    }

}
