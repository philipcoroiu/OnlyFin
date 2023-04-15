package se.onlyfin.onlyfinbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.onlyfin.onlyfinbackend.DTO.ProfileDTO;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * This class is responsible for handling all requests related to searching for analysts.
 */
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@RestController
public class SearchController {
    private final UserRepository userRepository;

    @Autowired
    public SearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * This method is responsible for returning a list of all analysts in the database.
     *
     * @return a list of all analysts in the database.
     */
    @GetMapping("/search-all-analysts")
    public ResponseEntity<Iterable<ProfileDTO>> findAllAnalysts() {
        Iterable<User> foundUsers = userRepository.findByisAnalystIsTrue();

        List<ProfileDTO> usersToReturnToClient = new ArrayList<>();
        foundUsers.forEach((currentUser ->
                usersToReturnToClient.add(new ProfileDTO(currentUser.getUsername(), currentUser.getId()))));

        return ResponseEntity.ok(usersToReturnToClient);
    }

    /**
     * This method is responsible for returning a single analyst with the given username.
     *
     * @param username the username of the analyst to be fetched.
     * @return the analyst with the given username.
     */
    @GetMapping("/get-analyst-by-name")
    public ResponseEntity<ProfileDTO> findAnalystByName(@RequestParam String username) {
        Optional<User> userOptional = userRepository.findByisAnalystIsTrueAndUsernameEquals(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User fetchedUser = userOptional.get();
        ProfileDTO profileDTOToSendToClient = new ProfileDTO(fetchedUser.getUsername(), fetchedUser.getId());

        return ResponseEntity.ok().body(profileDTOToSendToClient);
    }

    /**
     * This method is responsible for returning a list of analysts that match the given search string.
     *
     * @param search the search string to be used to find analysts.
     * @return a list of analysts that match the search string.
     */
    @GetMapping("/search-analyst")
    public ResponseEntity<List<ProfileDTO>> searchForAnalysts(@RequestParam String search) {
        List<User> userList = new ArrayList<>(userRepository.findTop7ByisAnalystIsTrueAndUsernameStartsWith(search));
        if (userList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<ProfileDTO> profileDTOListToSend = new ArrayList<>();
        userList.forEach((currentUser) ->
                profileDTOListToSend.add(new ProfileDTO(currentUser.getUsername(), currentUser.getId())));

        return ResponseEntity.ok().body(profileDTOListToSend);
    }

}
