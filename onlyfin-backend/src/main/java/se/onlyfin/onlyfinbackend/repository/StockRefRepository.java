package se.onlyfin.onlyfinbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.StockRef;

import java.util.List;

public interface StockRefRepository extends JpaRepository<StockRef, Integer> {

    List<StockRef> findTop7StockRefsByNameIgnoreCaseStartingWith(String name);

    List<StockRef> findTop7StockRefsByTickerIgnoreCaseStartingWith(String search);
}
