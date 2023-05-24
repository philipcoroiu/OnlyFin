package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Category;

/**
 * Repository mapping for the category table.
 */
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
