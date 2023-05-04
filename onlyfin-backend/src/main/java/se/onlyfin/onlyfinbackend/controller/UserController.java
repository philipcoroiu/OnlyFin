package se.onlyfin.onlyfinbackend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.AboutMeDTO;
import se.onlyfin.onlyfinbackend.DTO.AboutMeUpdateDTO;
import se.onlyfin.onlyfinbackend.DTO.PasswordUpdateDTO;
import se.onlyfin.onlyfinbackend.DTO.UserDTO;
import se.onlyfin.onlyfinbackend.model.NoSuchUserException;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import java.security.Principal;
import java.util.Optional;

/**
 * This class is responsible for handling requests related to user management.
 */
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@Controller
public class UserController {
    private final UserRepository userRepository;
    private final SubscriptionController subscriptionController;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, SubscriptionController subscriptionController, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.subscriptionController = subscriptionController;
        this.passwordEncoder = passwordEncoder;
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
    public ResponseEntity<User> fetchUserDebug(Principal principal, @RequestParam(required = false) String username) {
        if (!username.isEmpty()) {
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isPresent()) {
                User debugUser = userOptional.get();
                return ResponseEntity.ok().body(debugUser);
            }
        }

        if (principal != null) {
            Optional<User> userOptional = userRepository.findByUsername(principal.getName());
            if (userOptional.isPresent()) {
                User debugUser = userOptional.get();
                return ResponseEntity.ok().body(debugUser);
            }
        }

        return ResponseEntity.badRequest().build();
    }

    /**
     * Registers a new user. If the username or email is already registered, a bad request is returned.
     *
     * @param user UserDTO containing username, password and email.
     * @return ResponseEntity with status code 200 and username if registration was successful.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerNewUser(@RequestBody @Valid UserDTO user) {
        if (userRepository.existsByEmail(user.email())) {
            return ResponseEntity.badRequest().body("Email is already registered!");
        }
        if (userRepository.existsByUsername(user.username())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        User userToRegister = new User();
        userToRegister.setUsername(user.username());
        userToRegister.setPassword(new BCryptPasswordEncoder().encode(user.password()));
        userToRegister.setEmail(user.email());
        userToRegister.setEnabled(true);
        userToRegister.setRoles("ROLE_USER");
        userToRegister.setAnalyst(false);
        userRepository.save(userToRegister);

        return ResponseEntity.ok(user.username());
    }

    /**
     * Makes a user an analyst. If the user is already an analyst, a bad request is returned.
     *
     * @param principal Logged-in user that wants to become an analyst.
     * @return ResponseEntity with status code 200 if the user was successfully made an analyst.
     */
    @PutMapping("/enable-analyst")
    public ResponseEntity<String> enableAnalyst(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToBecomeAnalyst = userOptional.get();
        if (userToBecomeAnalyst.isAnalyst()) {
            return ResponseEntity.badRequest().body("User is already analyst");
        }

        userToBecomeAnalyst.setAnalyst(true);
        userRepository.save(userToBecomeAnalyst);

        return ResponseEntity.ok().build();
    }

    /**
     * Makes an analyst a regular user. If the user is not an analyst, a bad request is returned.
     *
     * @param principal Logged-in analyst that wants to become a regular user.
     * @return ResponseEntity with status code 200 if the analyst was successfully made a regular user.
     */
    @PutMapping("/disable-analyst")
    public ResponseEntity<String> disableAnalyst(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User analystToBecomeRegularUser = userOptional.get();
        if (!analystToBecomeRegularUser.isAnalyst()) {
            return ResponseEntity.badRequest().body("User is not analyst");
        }

        analystToBecomeRegularUser.setAnalyst(false);
        userRepository.save(analystToBecomeRegularUser);

        return ResponseEntity.ok().build();
    }

    /**
     * Returns the user id of the logged-in user
     *
     * @param principal The logged-in user
     * @return user id of principal
     */
    @GetMapping("/fetch-current-user-id")
    public ResponseEntity<Integer> fetchCurrentUserId(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToFetchUserIdFrom = userOptional.get();
        return ResponseEntity.ok().body(userToFetchUserIdFrom.getId());
    }

    /**
     * Returns the "about me" text for a specific user
     *
     * @param username the username of the target user
     * @return "about me" text
     */
    @GetMapping("/fetch-about-me")
    public ResponseEntity<?> fetchAboutMeFor(@RequestParam String username) {
        Optional<User> userOptionalTargetUser = userRepository.findByUsername(username);
        if (userOptionalTargetUser.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToGetAboutMeFrom = userOptionalTargetUser.get();
        return ResponseEntity.ok().body(userToGetAboutMeFrom.getAboutMe());
    }

    /**
     * Returns the "about me" text for a specific user with sub info included
     *
     * @param username the username of the target user
     * @return "about me" text & sub info
     */
    @GetMapping("/fetch-about-me-with-sub-info")
    public ResponseEntity<AboutMeDTO> fetchAboutMeWithSubInfoFor(@RequestParam String username, Principal principal) throws NoSuchUserException {
        User fetchingUser = userRepository.findByUsername(principal.getName()).orElseThrow(() ->
                new NoSuchUserException("Username not found!"));

        Optional<User> userOptionalTargetUser = userRepository.findByUsername(username);
        if (userOptionalTargetUser.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        User userToGetAboutMeFrom = userOptionalTargetUser.get();

        boolean subscribed = subscriptionController.isUserSubscribedToThisUser(fetchingUser, userToGetAboutMeFrom);

        return ResponseEntity.ok().body(new AboutMeDTO(userToGetAboutMeFrom.getAboutMe(), subscribed));
    }

    /**
     * Method to update the "about me" text for the logged-in user
     *
     * @param principal        The logged-in user
     * @param aboutMeUpdateDTO object containing the new "about me" text
     * @return Updated text if ok, bad request otherwise
     */
    @PutMapping("update-about-me")
    public ResponseEntity<?> updateAboutMe(Principal principal, @RequestBody AboutMeUpdateDTO aboutMeUpdateDTO) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (aboutMeUpdateDTO == null) {
            return ResponseEntity.badRequest().build();
        }

        User userWantingToUpdateAboutMe = userOptional.get();
        userWantingToUpdateAboutMe.setAboutMe(aboutMeUpdateDTO.text());
        userRepository.save(userWantingToUpdateAboutMe);

        return ResponseEntity.ok().body(aboutMeUpdateDTO.text());
    }

    /**
     * Returns the username of the logged-in user
     *
     * @param principal The logged-in user
     * @return username of principal
     */
    @GetMapping("/principal-username")
    public ResponseEntity<?> fetchUsernameOfPrincipal(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToGetUsernameOf = userOptional.get();
        return ResponseEntity.ok().body(userToGetUsernameOf.getUsername());
    }

    /**
     * Returns the user id of the logged-in user
     *
     * @param principal The logged-in user
     * @return user id of principal
     */
    @GetMapping("/principal-id")
    public ResponseEntity<?> fetchUserIdOfPrincipal(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToGetUserIdOf = userOptional.get();
        return ResponseEntity.ok().body(userToGetUserIdOf.getId());
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
    public ResponseEntity<String> changeUserPassword(@RequestBody PasswordUpdateDTO passwordUpdateDTO, Principal principal) {
        User userToChangePassword = userRepository.findByUsername(principal.getName()).orElseThrow(() ->
                new UsernameNotFoundException("Username not found!"));

        if (oldPasswordMatches(passwordUpdateDTO.oldPassword(), userToChangePassword)) {
            String encodedNewPassword = passwordEncoder.encode(passwordUpdateDTO.newPassword());
            userToChangePassword.setPassword(encodedNewPassword);
            userRepository.save(userToChangePassword);

            return ResponseEntity.ok().body("Updated password");
        } else {
            return ResponseEntity.badRequest().build();
        }

    }

    /**
     * This method is used to check if a given password matches a user's password.
     *
     * @param oldPasswordConfirmation The old password
     * @param user                    The user to check the old password against
     * @return true if the old password matches the user's password
     */
    private boolean oldPasswordMatches(String oldPasswordConfirmation, User user) {
        return passwordEncoder.matches(oldPasswordConfirmation, user.getPassword());
    }

}
