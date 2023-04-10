package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Stock_ref;

public interface Stock_refRepository extends JpaRepository<Stock_ref, Integer> {
}
