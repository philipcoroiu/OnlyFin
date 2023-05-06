package se.onlyfin.onlyfinbackend.service;

import jakarta.validation.Valid;
import org.springframework.lang.NonNull;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import se.onlyfin.onlyfinbackend.DTO.UserDTO;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUserOrException(@NonNull String username) {
        return userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Username not found!"));
    }

    public User getUserOrNull(@NonNull String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean registrable(@Valid UserDTO user) {
        return !userRepository.existsByEmail(user.email()) && !userRepository.existsByUsername(user.username());
    }

    public User registerUser(@Valid UserDTO userDTO) {
        if (registrable(userDTO)) {
            User userToRegister = new User();
            userToRegister.setUsername(userDTO.username());
            userToRegister.setPassword(new BCryptPasswordEncoder().encode(userDTO.password()));
            userToRegister.setEmail(userDTO.email());
            userToRegister.setEnabled(true);
            userToRegister.setRoles("ROLE_USER");
            userToRegister.setAnalyst(false);
            return userRepository.save(userToRegister);
        } else {
            return null;
        }
    }

    private boolean passwordMatches(String oldPasswordConfirmation, String currentPassword) {
        return passwordEncoder.matches(oldPasswordConfirmation, currentPassword);
    }

    public boolean passwordChange(@NonNull User targetUser, String oldPasswordConfirmation, String newPassword) {
        if (passwordMatches(oldPasswordConfirmation, targetUser.getPassword())) {
            String encodedNewPassword = passwordEncoder.encode(newPassword);
            targetUser.setPassword(encodedNewPassword);
            updateUser(targetUser);
            return true;
        } else {
            return false;
        }
    }

    public boolean enableAnalyst(@NonNull User targetUser) {
        if (targetUser.isAnalyst()) {
            return false;
        }

        targetUser.setAnalyst(true);
        userRepository.save(targetUser);

        return targetUser.isAnalyst();
    }

    public boolean disableAnalyst(@NonNull User targetUser) {
        if (!targetUser.isAnalyst()) {
            return false;
        }

        targetUser.setAnalyst(false);
        userRepository.save(targetUser);

        return !targetUser.isAnalyst();
    }

    public User updateUser(@NonNull User targetUser) {
        return userRepository.save(targetUser);
    }

    public User getUserOrNull(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserOrException(Integer id) {
        return userRepository.findById(id).orElseThrow();
    }

}
