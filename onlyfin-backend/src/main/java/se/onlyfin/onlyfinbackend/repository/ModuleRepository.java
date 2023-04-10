package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.ModuleEntity;

public interface ModuleRepository extends JpaRepository <ModuleEntity, Integer> {



}
