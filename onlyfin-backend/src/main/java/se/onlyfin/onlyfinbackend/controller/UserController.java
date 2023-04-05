package se.onlyfin.onlyfinbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.UserDTO;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

@Controller
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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

}
