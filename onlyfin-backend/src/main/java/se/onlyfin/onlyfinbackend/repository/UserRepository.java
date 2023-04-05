package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.repository.CrudRepository;
import se.onlyfin.onlyfinbackend.model.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, String> {
    /**
     * Find any user by email
     *
     * @param username the email of the user
     * @return the user if found
     */
    Optional<User> findByEmail(String username);

    /**
     * Find any user by username
     *
     * @param username the username of the user
     * @return the user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if any user exists by username
     *
     * @param username the username of the user
     * @return true if the user exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if any user exists by email
     *
     * @param email the email of the user
     * @return true if the user exists
     */
    boolean existsByEmail(String email);

    /**
     * Delete any user by email
     *
     * @param email the email of the user
     * @return true if the user was deleted
     */
    boolean deleteByEmail(String email);

    /**
     * Find all users that are analysts
     *
     * @return all users that are analysts
     */
    Iterable<User> findByisAnalystIsTrue();

    /**
     * Find analyst by username
     *
     * @param username the username of the analyst
     * @return the analyst if found
     */
    Optional<User> findByisAnalystIsTrueAndUsernameEquals(String username);
}
