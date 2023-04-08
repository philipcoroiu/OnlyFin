package se.onlyfin.onlyfinbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.onlyfin.onlyfinbackend.model.ProfileDTO;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.ok;

@RestController
public class SearchController {
    private final UserRepository userRepository;

    public SearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search-all-analysts")
    public ResponseEntity<Iterable<ProfileDTO>> findAllAnalysts() {
        Iterable<User> foundUsers = userRepository.findByisAnalystIsTrue();
        List<ProfileDTO> usersToReturnToClient = new ArrayList<>();
        foundUsers.forEach((currentUser -> usersToReturnToClient.add(new ProfileDTO(currentUser.getUsername(), currentUser.getId()))));
        return ResponseEntity.ok(usersToReturnToClient);
    }

    @GetMapping("/get-analyst-by-name")
    public ResponseEntity<ProfileDTO> findAnalystByName(@RequestParam String username) {
        ProfileDTO profileDTOToSendToClient;
        Optional<User> userOptional = userRepository.findByisAnalystIsTrueAndUsernameEquals(username);
        if (userOptional.isPresent()) {
            User fetchedUser = userOptional.get();
            profileDTOToSendToClient = new ProfileDTO(fetchedUser.getUsername(), fetchedUser.getId());
            return ok(profileDTOToSendToClient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search-analyst")
    public ResponseEntity<List<ProfileDTO>> searchForAnalysts(@RequestParam String search) {
        //fetch all users
        List<User> userList = new ArrayList<>(userRepository.findTop7ByisAnalystIsTrueAndUsernameStartsWith(search));

        if (userList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<ProfileDTO> profileDTOListToSend = new ArrayList<>();
        //convert each user object to profile object
        userList.forEach((currentUser) -> profileDTOListToSend.add(new ProfileDTO(currentUser.getUsername(), currentUser.getId())));

        return ResponseEntity.ok().body(profileDTOListToSend);
    }

}