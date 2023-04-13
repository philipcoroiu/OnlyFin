package se.onlyfin.onlyfinbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.UserDTO;
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

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user-debug")
    @Deprecated
    public ResponseEntity<?> fetchUserDebug(Principal principal, @RequestParam(required = false) String username) {
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
    public ResponseEntity<String> registerNewUser(@RequestBody UserDTO user) {
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

    @GetMapping("/fetch-current-user-id")
    public ResponseEntity<Integer> fetchCurrentUserId(Principal principal) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToFetchUserIdFrom = userOptional.get();

        return ResponseEntity.ok().body(userToFetchUserIdFrom.getId());
    }

    @GetMapping("/fetch-about-me")
    public ResponseEntity<?> fetchAboutMeFor(@RequestParam String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User userToGetAboutMeFrom = userOptional.get();
        return ResponseEntity.ok().body(userToGetAboutMeFrom.getAboutMe());
    }

    @PutMapping("update-about-me")
    public ResponseEntity<?> updateAboutMe(Principal principal, @RequestBody String text) {
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (text == null) {
            return ResponseEntity.badRequest().build();
        }

        User userWantingToUpdateAboutMe = userOptional.get();
        userWantingToUpdateAboutMe.setAboutMe(text);
        userRepository.save(userWantingToUpdateAboutMe);

        return ResponseEntity.ok().body(text);
    }

}
