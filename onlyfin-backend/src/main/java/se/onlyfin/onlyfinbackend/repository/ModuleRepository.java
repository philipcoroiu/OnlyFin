package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard.ModuleEntity;

public interface ModuleRepository extends JpaRepository <ModuleEntity, Integer> {

}
