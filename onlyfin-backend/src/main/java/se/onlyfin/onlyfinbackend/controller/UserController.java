package se.onlyfin.onlyfinbackend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.AboutMeDTO;
import se.onlyfin.onlyfinbackend.DTO.AboutMeUpdateDTO;
import se.onlyfin.onlyfinbackend.DTO.PasswordUpdateDTO;
import se.onlyfin.onlyfinbackend.DTO.UserDTO;
import se.onlyfin.onlyfinbackend.model.OnlyfinUserPrincipal;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.service.UserService;

import java.security.Principal;

/**
 * This class is responsible for handling requests related to user management.
 */
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@Controller
public class UserController {
    private final SubscriptionController subscriptionController;
    private final UserService userService;

    @Autowired
    public UserController(SubscriptionController subscriptionController, UserService userService) {
        this.subscriptionController = subscriptionController;
        this.userService = userService;
    }

    /**
     * WARNING: ONLY FOR DEVELOPMENT.
     * SHOULD NOT BE INCLUDED IN PRODUCTION!
     * Debug method to fetch the user object of the logged-in user.
     * Alternatively, if a username is passed in, the user object with that username is returned.
     *
     * @param principal The logged-in user
     * @param username  optional username search string
     * @return Response with the entire user object
     */
    @GetMapping("/user-debug")
    @Deprecated
    public ResponseEntity<User> fetchUserDebug(@AuthenticationPrincipal OnlyfinUserPrincipal principal, @RequestParam(required = false) String username) {
        if (!username.isEmpty()) {
            User targetUser = userService.getUserOrNull(username);
            return ResponseEntity.ok().body(targetUser);
        }

        if (principal != null) {
            User fetchingUser = principal.getUser();
            return ResponseEntity.ok().body(fetchingUser);
        }

        return ResponseEntity.badRequest().build();
    }

    /**
     * Registers a new user. If the username or email is already registered, a bad request is returned.
     *
     * @param userDTO UserDTO containing username, password and email.
     * @return ResponseEntity with status code 200 and username if registration was successful.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(@RequestBody @Valid UserDTO userDTO) {
        User registeredUser = userService.registerUser(userDTO);
        if (registeredUser == null) {
            return ResponseEntity.badRequest().body("Registration failed");
        }

        return ResponseEntity.ok(registeredUser.getUsername());
    }

    /**
     * Makes a user an analyst. If the user is already an analyst, a bad request is returned.
     *
     * @param principal Logged-in user that wants to become an analyst.
     * @return ResponseEntity with status code 200 if the user was successfully made an analyst.
     */
    @PutMapping("/enable-analyst")
    public ResponseEntity<String> enableAnalyst(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User targetUser = principal.getUser();
        boolean succeeded = userService.enableAnalyst(targetUser);

        if (!succeeded) {
            return ResponseEntity.badRequest().body("User is already analyst!");
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Makes an analyst a regular user. If the user is not an analyst, a bad request is returned.
     *
     * @param principal Logged-in analyst that wants to become a regular user.
     * @return ResponseEntity with status code 200 if the analyst was successfully made a regular user.
     */
    @PutMapping("/disable-analyst")
    public ResponseEntity<String> disableAnalyst(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User targetUser = principal.getUser();
        boolean succeeded = userService.disableAnalyst(targetUser);

        if (!succeeded) {
            return ResponseEntity.badRequest().body("User is not analyst!");
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Returns the user id of the logged-in user
     *
     * @param principal The logged-in user
     * @return user id of principal
     */
    @GetMapping("/fetch-current-user-id")
    public ResponseEntity<Integer> fetchCurrentUserId(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User targetUser = principal.getUser();

        Integer userId = targetUser.getId();
        return ResponseEntity.ok().body(userId);
    }

    /**
     * Returns the "about me" text for a specific user
     *
     * @param username the username of the target user
     * @return "about me" text
     */
    @GetMapping("/fetch-about-me")
    public ResponseEntity<String> fetchAboutMeFor(@RequestParam String username) {
        User targetUser = userService.getUserOrNull(username);
        if (targetUser == null) {
            return ResponseEntity.badRequest().build();
        }

        String aboutMe = targetUser.getAboutMe();
        return ResponseEntity.ok().body(aboutMe);
    }

    /**
     * Returns the "about me" text for a specific user with sub info included
     *
     * @param username the username of the target user
     * @return "about me" text & sub info
     */
    @GetMapping("/fetch-about-me-with-sub-info")
    public ResponseEntity<AboutMeDTO> fetchAboutMeWithSubInfoFor(@RequestParam String username, @AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User fetchingUser = principal.getUser();

        User targetUser = userService.getUserOrNull(username);
        if (targetUser == null) {
            return ResponseEntity.badRequest().build();
        }

        boolean isSubscribed = subscriptionController.isUserSubscribedToThisUser(fetchingUser, targetUser);
        AboutMeDTO aboutMe = new AboutMeDTO(targetUser.getAboutMe(), isSubscribed);

        return ResponseEntity.ok().body(aboutMe);
    }

    /**
     * Method to update the "about me" text for the logged-in user
     *
     * @param principal        The logged-in user
     * @param aboutMeUpdateDTO object containing the new "about me" text
     * @return Updated text if ok, bad request otherwise
     */
    @PutMapping("update-about-me")
    public ResponseEntity<String> updateAboutMe(@AuthenticationPrincipal OnlyfinUserPrincipal principal, @RequestBody AboutMeUpdateDTO aboutMeUpdateDTO) {
        if (aboutMeUpdateDTO == null) {
            return ResponseEntity.badRequest().build();
        }

        User actingUser = principal.getUser();
        actingUser.setAboutMe(aboutMeUpdateDTO.text());
        userService.updateUser(actingUser);

        return ResponseEntity.ok().body(aboutMeUpdateDTO.text());
    }

    /**
     * Returns the username of the logged-in user
     *
     * @param principal The logged-in user
     * @return username of principal
     */
    @GetMapping("/principal-username")
    public ResponseEntity<String> fetchUsernameOfPrincipal(Principal principal) {
        String username = principal.getName();

        return ResponseEntity.ok().body(username);
    }

    /**
     * Returns the user id of the logged-in user
     *
     * @param principal The logged-in user
     * @return user id of principal
     */
    @GetMapping("/principal-id")
    public ResponseEntity<Integer> fetchUserIdOfPrincipal(@AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User fetchingUser = principal.getUser();

        return ResponseEntity.ok().body(fetchingUser.getId());
    }

    /**
     * This method is used to change the password of a user.
     * The user must provide both the old password and input a new password.
     *
     * @param passwordUpdateDTO DTO containing the old and new password
     * @param principal         The logged-in user
     * @return Status code 200 if the password was successfully changed.
     */
    @PostMapping("/password-update")
    public ResponseEntity<String> changeUserPassword(@RequestBody PasswordUpdateDTO passwordUpdateDTO, @AuthenticationPrincipal OnlyfinUserPrincipal principal) {
        User userToChangePassword = principal.getUser();

        boolean succeeded = userService.passwordChange(userToChangePassword, passwordUpdateDTO.oldPassword(), passwordUpdateDTO.newPassword());

        if (!succeeded) {
            return ResponseEntity.badRequest().body("Password does not match");
        }

        return ResponseEntity.ok().body("Updated password");
    }

}
