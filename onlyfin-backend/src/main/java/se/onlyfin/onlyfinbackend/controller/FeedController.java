package se.onlyfin.onlyfinbackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.onlyfin.onlyfinbackend.DTO.CategoryDTO;
import se.onlyfin.onlyfinbackend.DTO.FeedCardDTO;
import se.onlyfin.onlyfinbackend.DTO.ProfileDTO;
import se.onlyfin.onlyfinbackend.DTO.StockDTO;
import se.onlyfin.onlyfinbackend.model.FeedCard;
import se.onlyfin.onlyfinbackend.model.Subscription;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Category;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Dashboard;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.ModuleEntity;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Stock;
import se.onlyfin.onlyfinbackend.repository.FeedCardRepository;
import se.onlyfin.onlyfinbackend.repository.SubscriptionRepository;
import se.onlyfin.onlyfinbackend.service.UserService;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/feed")
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
public class FeedController {
    private final DashboardController dashboardController;
    private final UserService userService;
    private final SubscriptionRepository subscriptionRepository;
    private final FeedCardRepository feedCardRepository;

    public FeedController(DashboardController dashboardController, UserService userService,
                          SubscriptionRepository subscriptionRepository, FeedCardRepository feedCardRepository) {
        this.dashboardController = dashboardController;
        this.userService = userService;
        this.subscriptionRepository = subscriptionRepository;
        this.feedCardRepository = feedCardRepository;
    }

    /**
     * This method fetches all the feed cards for the user that is logged in.
     *
     * @param principal the user that is logged in
     * @return a list of feed cards
     */
    @GetMapping("/all-the-things")
    public ResponseEntity<List<FeedCardDTO>> fetchFeedAll(Principal principal) {
        User userToFetchFeedFor = userService.getUserOrException(principal.getName());

        List<Subscription> subscriptions = subscriptionRepository.findBySubscriber(userToFetchFeedFor);
        if (subscriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        HashMap<String, Integer> analystUsernameToIdMap = new HashMap<>();
        ArrayList<FeedCard> feedCards = new ArrayList<>();
        for (Subscription subscription : subscriptions) {
            User currentAnalyst = subscription.getSubscribedTo();
            feedCards.addAll(feedCardRepository.findByAnalystUsernameOrderByPostDateDesc(currentAnalyst.getUsername()));
            analystUsernameToIdMap.put(currentAnalyst.getUsername(), currentAnalyst.getId());
        }

        List<FeedCardDTO> feedCardDTOS = craftFeedCardDTOList(analystUsernameToIdMap, feedCards);

        return ResponseEntity.ok().body(feedCardDTOS);
    }

    /**
     * This method fetches feed cards from the last 7 days for the user that is logged in.
     *
     * @param principal the user that is logged in
     * @return a list of feed cards from the last 7 days
     */
    @GetMapping("/week")
    public ResponseEntity<List<FeedCardDTO>> fetchFeedWeek(Principal principal) {
        User userToFetchFeedFor = userService.getUserOrException(principal.getName());

        List<Subscription> subscriptions = subscriptionRepository.findBySubscriber(userToFetchFeedFor);
        if (subscriptions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        Instant cutoffDate = Instant.now().minus(7, ChronoUnit.DAYS);
        HashMap<String, Integer> analystUsernameToId = new HashMap<>();
        ArrayList<FeedCard> feedCards = new ArrayList<>();
        for (Subscription subscription : subscriptions) {
            User currentAnalyst = subscription.getSubscribedTo();
            feedCards.addAll(
                    feedCardRepository.findByAnalystUsernameAndPostDateAfterOrderByPostDateDesc(
                            currentAnalyst.getUsername(),
                            cutoffDate));
            analystUsernameToId.put(currentAnalyst.getUsername(), currentAnalyst.getId());
        }

        List<FeedCardDTO> feedCardDTOS = craftFeedCardDTOList(analystUsernameToId, feedCards);

        return ResponseEntity.ok().body(feedCardDTOS);
    }

    /**
     * This method fetches all the feed cards for the user that is logged in.
     *
     * @param principal the user that is logged in
     * @return a list of feed cards
     */
    @GetMapping("/old-all-the-things")
    @Deprecated
    public ResponseEntity<List<FeedCardDTO>> fetchAllTheFeed(Principal principal) {
        //check that logged-in user exists
        User userToFetchFeedFor = userService.getUserOrException(principal.getName());

        //check that user has subscriptions
        if (userToFetchFeedFor.getSubscriptions().size() < 1) {
            return ResponseEntity.noContent().build();
        }

        //grab their subscriptions
        List<Subscription> subscriptionList = new ArrayList<>(userToFetchFeedFor.getSubscriptions());

        //assemble a map of dashboards for subscribed-to analysts, so each dashboard can be linked to its owner
        HashMap<User, Dashboard> dashboardOwnershipMap = createDashboardOwnershipMap(subscriptionList);

        List<FeedCardDTO> feedCardDTOS = new ArrayList<>();
        for (User currentAnalystUser : dashboardOwnershipMap.keySet()) {
            //dashboard of currentAnalystUser
            Dashboard currentDashboard = dashboardOwnershipMap.get(currentAnalystUser);

            //check that the current analyst has a dashboard because that's apparently not always the case...
            if (currentDashboard != null) {
                //profile representation of currentAnalystUser
                ProfileDTO currentAnalystProfileDTO = new ProfileDTO(
                        currentAnalystUser.getUsername(),
                        currentAnalystUser.getId());

                //stocks that currentAnalystUser covers
                List<Stock> stocksCoveredByCurrentAnalyst = new ArrayList<>(currentDashboard.getStocks());

                pushAnalystContentToList(feedCardDTOS, currentAnalystProfileDTO, stocksCoveredByCurrentAnalyst);
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
    @GetMapping("/oldweek")
    @Deprecated
    public ResponseEntity<List<FeedCardDTO>> fetchWeeklyFeed(Principal principal) {
        //check that logged-in user exists
        User userToFetchFeedFor = userService.getUserOrException(principal.getName());

        //check that user has subscriptions
        if (userToFetchFeedFor.getSubscriptions().size() < 1) {
            return ResponseEntity.noContent().build();
        }

        //grab their subscriptions
        List<Subscription> subscriptionList = new ArrayList<>(userToFetchFeedFor.getSubscriptions());

        //assemble a map of dashboards for subscribed-to analysts, so each dashboard can be linked to analyst
        HashMap<User, Dashboard> dashboardOwnershipMap = new HashMap<>();
        for (Subscription currentSubscription : subscriptionList) {
            User ownerOfDashboard = currentSubscription.getSubscribedTo();

            Dashboard ownersDashboard = dashboardController.fetchDashboardOrNull(
                    currentSubscription
                    .getSubscribedTo()
                    .getId());

            dashboardOwnershipMap.put(ownerOfDashboard, ownersDashboard);
        }

        List<FeedCardDTO> feedCardDTOS = new ArrayList<>();
        for (User currentAnalystUser : dashboardOwnershipMap.keySet()) {
            //dashboard of currentAnalystUser
            Dashboard currentDashboard = dashboardOwnershipMap.get(currentAnalystUser);

            //check that the current analyst has a dashboard because that's apparently not always the case...
            if (currentDashboard != null) {
                //profile representation of currentAnalystUser
                ProfileDTO currentAnalystProfileDTO = new ProfileDTO(
                        currentAnalystUser.getUsername(),
                        currentAnalystUser.getId());

                //stocks that currentAnalystUser covers
                List<Stock> stocksCoveredByCurrentAnalyst = new ArrayList<>(currentDashboard.getStocks());

                //go through stocks that currentAnalystUser covers
                for (Stock currentStockThatCurrentAnalystCovers : stocksCoveredByCurrentAnalyst) {
                    //categories under current stock that currentAnalystUser covers
                    for (Category categoryUnderCurrentStockThatCurrentAnalystCovers : currentStockThatCurrentAnalystCovers.getCategories()) {
                        //current module under the current stock category
                        for (ModuleEntity moduleEntityUnderCurrentStockThatCurrentAnalystCovers : categoryUnderCurrentStockThatCurrentAnalystCovers.getModuleEntities()) {
                            if (moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getPostDate().isAfter(Instant.now().minus(7, ChronoUnit.DAYS))) {
                                JsonNode content = moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getContent();
                                //create "feed card" using all available content
                                feedCardDTOS.add(new FeedCardDTO(
                                        currentAnalystProfileDTO,
                                        new StockDTO(
                                                currentStockThatCurrentAnalystCovers.getName(),
                                                currentStockThatCurrentAnalystCovers.getId()),
                                        new CategoryDTO(
                                                categoryUnderCurrentStockThatCurrentAnalystCovers.getName(),
                                                categoryUnderCurrentStockThatCurrentAnalystCovers.getId()),
                                        content,
                                        LocalDateTime.ofInstant(
                                                        moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getPostDate(),
                                                        ZoneId.systemDefault())
                                                .format(DateTimeFormatter
                                                        .ofPattern("dd MMMM HH:mm yyyy", Locale.ENGLISH)),
                                        LocalDateTime.ofInstant(
                                                        moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getUpdatedDate(),
                                                        ZoneId.systemDefault())
                                                .format(DateTimeFormatter
                                                        .ofPattern("dd MMMM HH:mm yyyy", Locale.ENGLISH))));
                            }
                        }
                    }
                }
            }

        }
        //sort all the things so that the newest content is first(that's why reversed is used)
        feedCardDTOS.sort(Comparator.comparing(FeedCardDTO::postDate).reversed());

        return ResponseEntity.ok().body(feedCardDTOS);
    }

    /**
     * This method pushes all the content from a specific analyst to an inputted list
     *
     * @param feedCardDTOS                  list of feed cards
     * @param currentAnalystProfileDTO      profile of current analyst
     * @param stocksCoveredByCurrentAnalyst list of stocks covered by current analyst
     */
    private void pushAnalystContentToList(List<FeedCardDTO> feedCardDTOS, ProfileDTO currentAnalystProfileDTO, List<Stock> stocksCoveredByCurrentAnalyst) {
        //go through stocks that currentAnalystUser covers
        for (Stock currentStockThatCurrentAnalystCovers : stocksCoveredByCurrentAnalyst) {
            //categories under current stock that currentAnalystUser covers
            for (Category categoryUnderCurrentStockThatCurrentAnalystCovers : currentStockThatCurrentAnalystCovers.getCategories()) {
                //current module under the current stock category
                for (ModuleEntity moduleEntityUnderCurrentStockThatCurrentAnalystCovers : categoryUnderCurrentStockThatCurrentAnalystCovers.getModuleEntities()) {
                    JsonNode content = moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getContent();
                    //create "feed card" using all available content
                    feedCardDTOS.add(craftFeedCard(currentAnalystProfileDTO, currentStockThatCurrentAnalystCovers, categoryUnderCurrentStockThatCurrentAnalystCovers, moduleEntityUnderCurrentStockThatCurrentAnalystCovers, content));
                }
            }
        }
    }

    /**
     * This method crafts a feed card inputted content
     *
     * @param currentAnalystProfileDTO                              profile of current analyst
     * @param currentStockThatCurrentAnalystCovers                  stock
     * @param categoryUnderCurrentStockThatCurrentAnalystCovers     stock category
     * @param moduleEntityUnderCurrentStockThatCurrentAnalystCovers module entity
     * @param content                                               content
     * @return a feed card with the inputted content
     */
    private FeedCardDTO craftFeedCard(ProfileDTO currentAnalystProfileDTO,
                                      Stock currentStockThatCurrentAnalystCovers,
                                      Category categoryUnderCurrentStockThatCurrentAnalystCovers,
                                      ModuleEntity moduleEntityUnderCurrentStockThatCurrentAnalystCovers,
                                      JsonNode content) {
        return new FeedCardDTO(
                currentAnalystProfileDTO,
                new StockDTO(
                        currentStockThatCurrentAnalystCovers.getName(),
                        currentStockThatCurrentAnalystCovers.getId()),
                new CategoryDTO(
                        categoryUnderCurrentStockThatCurrentAnalystCovers.getName(),
                        categoryUnderCurrentStockThatCurrentAnalystCovers.getId()),
                content,
                LocalDateTime.ofInstant(
                                moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getPostDate(),
                                ZoneId.systemDefault())
                        .format(DateTimeFormatter
                                .ofPattern("dd MMMM HH:mm yyyy", Locale.ENGLISH)),
                LocalDateTime.ofInstant(
                                moduleEntityUnderCurrentStockThatCurrentAnalystCovers.getUpdatedDate(),
                                ZoneId.systemDefault())
                        .format(DateTimeFormatter
                                .ofPattern("dd MMMM HH:mm yyyy", Locale.ENGLISH)));
    }

    /**
     * This method creates a map with analysts as keys and their dashboards as values
     *
     * @param subscriptionList list of subscriptions
     * @return a map of dashboards connected to analysts
     */
    private HashMap<User, Dashboard> createDashboardOwnershipMap(List<Subscription> subscriptionList) {
        HashMap<User, Dashboard> dashboardOwnershipMap = new HashMap<>();
        for (Subscription currentSubscription : subscriptionList) {
            User ownerOfDashboard = currentSubscription.getSubscribedTo();

            Dashboard ownersDashboard = dashboardController.fetchDashboardOrNull(ownerOfDashboard.getId());

            dashboardOwnershipMap.put(ownerOfDashboard, ownersDashboard);
        }
        return dashboardOwnershipMap;
    }

    /**
     * This method crafts a list of feed card DTOs using inputted feed cards and analyst username to id map
     *
     * @param analystUsernameToIdMap map of analyst usernames to their ids
     * @param feedCards              list of feed cards
     * @return a list of feed card DTOs
     */
    private static List<FeedCardDTO> craftFeedCardDTOList(HashMap<String, Integer> analystUsernameToIdMap, ArrayList<FeedCard> feedCards) {
        return feedCards.stream()
                .map(feedCard -> new FeedCardDTO(
                        new ProfileDTO(feedCard.getAnalystUsername(), analystUsernameToIdMap.get(feedCard.getAnalystUsername())),
                        new StockDTO(feedCard.getStockName(), -1),
                        new CategoryDTO(feedCard.getCategoryName(), feedCard.getCategoryId()),
                        feedCard.getContent(),
                        LocalDateTime.ofInstant(feedCard.getPostDate(), ZoneId.systemDefault())
                                .format(DateTimeFormatter.ofPattern("dd MMMM HH:mm yyyy", Locale.ENGLISH)),
                        LocalDateTime.ofInstant(feedCard.getUpdatedDate(), ZoneId.systemDefault())
                                .format(DateTimeFormatter.ofPattern("dd MMMM HH:mm yyyy", Locale.ENGLISH))))
                .sorted(Comparator.comparing(FeedCardDTO::postDate).reversed())
                .collect(Collectors.toList());
    }

}
