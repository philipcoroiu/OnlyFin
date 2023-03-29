package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.repository.CrudRepository;
import se.onlyfin.onlyfinbackend.model.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, String> {
    Optional<User> findByEmail(String username);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean deleteByEmail(String email);
}
