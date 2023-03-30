package se.onlyfin.onlyfinbackend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import se.onlyfin.onlyfinbackend.controller.UserController;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.UserDTO;
import se.onlyfin.onlyfinbackend.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserControllerTests {
    @Mock
    private UserRepository userRepository;

    private UserController userController;

    @BeforeEach
    // Create a new UserController instance before each test
    // Create a mock UserRepository instance
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        userController = new UserController(userRepository);
    }

    @Test
    // Test that a new user can be registered if username and email are not already registered in the database
    // and test that the response body contains the username of the new user
    public void testRegisterNewUser() {
        UserDTO userDTO = new UserDTO("testuser", "testpassword", "testemail@test.com");

        Mockito.when(userRepository.existsByEmail(userDTO.email())).thenReturn(false);
        Mockito.when(userRepository.existsByUsername(userDTO.username())).thenReturn(false);

        ResponseEntity<String> response = userController.registerNewUser(userDTO);

        Mockito.verify(userRepository, Mockito.times(1)).save(Mockito.any(User.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userDTO.username(), response.getBody());
    }

    @Test
    // Test that a new user cannot be registered if email is already registered in the database
    // Test that the response body contains a bad request message saying that the email is already registered
    public void testRegisterNewUserWithEmailAlreadyRegistered() {
        UserDTO userDTO = new UserDTO("testuser", "testpassword", "testemail@test.com");

        Mockito.when(userRepository.existsByEmail(userDTO.email())).thenReturn(true);

        ResponseEntity<String> response = userController.registerNewUser(userDTO);

        Mockito.verify(userRepository, Mockito.times(0)).save(Mockito.any(User.class));
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email is already registered!", response.getBody());
    }

    @Test
    // Test that a new user cannot be registered if username is already taken in the database
    // Test that the response body contains a bad request message saying that the username is already taken
    public void testRegisterNewUserWithUsernameAlreadyTaken() {
        UserDTO userDTO = new UserDTO("testuser", "testpassword", "testemail@test.com");

        Mockito.when(userRepository.existsByEmail(userDTO.email())).thenReturn(false);
        Mockito.when(userRepository.existsByUsername(userDTO.username())).thenReturn(true);

        ResponseEntity<String> response = userController.registerNewUser(userDTO);

        Mockito.verify(userRepository, Mockito.times(0)).save(Mockito.any(User.class));
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username is already taken!", response.getBody());
    }

}
