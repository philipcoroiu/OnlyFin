package se.onlyfin.onlyfinbackend.controller;

import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.UserDTO;
import se.onlyfin.onlyfinbackend.model.AnalystReview;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Category;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Dashboard;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Stock;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.StockRef;
import se.onlyfin.onlyfinbackend.repository.AnalystReviewRepository;
import se.onlyfin.onlyfinbackend.repository.CategoryRepository;
import se.onlyfin.onlyfinbackend.repository.StockRepository;
import se.onlyfin.onlyfinbackend.service.UserService;

import java.security.Principal;

/**
 * This class is responsible for setting up user accounts that are meant to be used in black-box tests of the system.
 */
@RestController
@RequestMapping("/tests")
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
public class TestSetupController {
    private static final String TEST_PRODUCER_USERNAME = "TEST_PROD";
    private static final String TEST_PRODUCER_PASSWORD = "TEST_PROD";
    private static final String TEST_PRODUCER_EMAIL = "TEST_PROD@example.org";
    private final UserDTO TEST_PRODUCER_DTO;

    private static final String TEST_CONSUMER_USERNAME = "TEST_CON";
    private static final String TEST_CONSUMER_PASSWORD = "TEST_CON";
    private static final String TEST_CONSUMER_EMAIL = "TEST_CON@example.org";
    private final UserDTO TEST_CONSUMER_DTO;

    private final UserService userService;
    private final SubscriptionController subscriptionController;
    private final AnalystReviewController analystReviewController;
    private final AnalystReviewRepository analystReviewRepository;
    private final StudioController studioController;
    private final StockReferenceController stockReferenceController;
    private final StockRepository stockRepository;
    private final CategoryRepository categoryRepository;

    public TestSetupController(UserService userService, SubscriptionController subscriptionController, AnalystReviewController analystReviewController, AnalystReviewRepository analystReviewRepository, StudioController studioController, StockReferenceController stockReferenceController, StockRepository stockRepository, CategoryRepository categoryRepository) {
        this.userService = userService;
        this.subscriptionController = subscriptionController;
        this.analystReviewController = analystReviewController;
        this.analystReviewRepository = analystReviewRepository;
        this.studioController = studioController;
        this.stockReferenceController = stockReferenceController;
        this.stockRepository = stockRepository;
        this.categoryRepository = categoryRepository;

        TEST_PRODUCER_DTO = new UserDTO(TEST_PRODUCER_EMAIL, TEST_PRODUCER_USERNAME, TEST_PRODUCER_PASSWORD);
        TEST_CONSUMER_DTO = new UserDTO(TEST_CONSUMER_EMAIL, TEST_CONSUMER_USERNAME, TEST_CONSUMER_PASSWORD);
    }

    @GetMapping("/reset")
    public void resetAllTheThings() {
        resetConsumer();
        resetProducer();
        setupAccounts();
    }

    @GetMapping("/registration1")
    public void setUpRegistration1() {
        User targetUser = userService.getUserOrNull("TEST_REG");
        if (targetUser != null) {
            userService.deleteUser(targetUser);
        }
    }

    @GetMapping("/profile2")
    public void setUpProfile2() {
        User targetUser = userService.getUserOrException("TEST_PROD");

        AnalystReview analystReview = new AnalystReview();
        analystReview.setAuthorUsername("TEST_CON");
        analystReview.setTargetUser(targetUser);
        analystReview.setReviewText("test review");
        analystReviewRepository.save(analystReview);
    }

    public void resetConsumer() {
        User testConsumer = userService.getUserOrNull(TEST_CONSUMER_USERNAME);
        if (testConsumer != null) {
            subscriptionController.removeAllSubscriptionsRelatedToUser(testConsumer);
            analystReviewController.deleteAllReviewsRelatedToUser(testConsumer);
            userService.deleteUser(testConsumer);
        }
    }

    public void resetProducer() {
        User testProducer = userService.getUserOrNull(TEST_PRODUCER_USERNAME);
        if (testProducer != null) {
            subscriptionController.removeAllSubscriptionsRelatedToUser(testProducer);
            analystReviewController.deleteAllReviewsRelatedToUser(testProducer);
            userService.deleteUser(testProducer);
        }
    }

    public void setupAccounts() {
        User testProducer = userService.registerUser(TEST_PRODUCER_DTO);
        User testConsumer = userService.registerUser(TEST_CONSUMER_DTO);
        userService.enableAnalyst(testProducer);
    }

}
