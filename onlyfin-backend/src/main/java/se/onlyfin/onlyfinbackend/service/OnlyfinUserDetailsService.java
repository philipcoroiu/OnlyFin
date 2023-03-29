package se.onlyfin.onlyfinbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import se.onlyfin.onlyfinbackend.model.OnlyfinUserPrincipal;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

@Service
public class OnlyfinUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public OnlyfinUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByEmail(username)
                .map(OnlyfinUserPrincipal::new)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found: " + username));
    }
}
