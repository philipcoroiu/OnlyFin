package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard.Dashboard;

import java.util.Optional;

public interface DashboardRepository extends JpaRepository<Dashboard, String> {
    Optional<Dashboard> findById(String id);
}
