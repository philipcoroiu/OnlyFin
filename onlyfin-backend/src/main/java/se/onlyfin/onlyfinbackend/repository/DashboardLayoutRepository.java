package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.DashboardLayout;

import java.util.List;

public interface DashboardLayoutRepository extends JpaRepository<DashboardLayout, Integer> {

    List<DashboardLayout> findByCategoryId(Integer categoryId);

}
