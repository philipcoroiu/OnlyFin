package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.ModuleEntity;

/**
 * Repository mapping for the module table.
 */
public interface ModuleRepository extends JpaRepository<ModuleEntity, Integer> {
}
