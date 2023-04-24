package se.onlyfin.onlyfinbackend.controller;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Category;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Dashboard;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.ModuleEntity;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.Stock;
import se.onlyfin.onlyfinbackend.repository.DashboardRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;

    @GetMapping("/{id}")

    public ResponseEntity<Dashboard> getDashboard(@PathVariable String id) {

        try {
            int id_id = Integer.parseInt(id);
            Optional<Dashboard> optionalDashboard = dashboardRepository.findById(id_id);
            Dashboard dashboard = optionalDashboard.orElse(null);
            if (dashboard == null) {
                System.out.println("is null");
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.badRequest().build();
    }

    public Instant fetchAnalystsLastPostTime(@NonNull User targetAnalyst) {
        Dashboard targetAnalystsDashboard = dashboardRepository.findById(targetAnalyst.getId()).orElseThrow();

        List<Stock> analystsStocks = targetAnalystsDashboard.getStocks();
        Instant latestInstant = Instant.MIN;
        for (Stock currentStock : analystsStocks) {
            for (Category currentCategoryUnderStock : currentStock.getCategories()) {
                for (ModuleEntity currentModuleUnderCategory : currentCategoryUnderStock.getModuleEntities()) {
                    Instant currentInstant = currentModuleUnderCategory.getPostDate();
                    if (currentInstant.isAfter(latestInstant)) {
                        latestInstant = currentInstant;
                    }
                }
            }
        }

        return latestInstant;
    }

    public Instant fetchAnalystsLastUpdateTime(@NonNull User targetAnalyst) {
        Dashboard targetAnalystsDashboard = dashboardRepository.findById(targetAnalyst.getId()).orElseThrow();

        List<Stock> analystsStocks = targetAnalystsDashboard.getStocks();
        Instant latestInstant = Instant.MIN;
        for (Stock currentStock : analystsStocks) {
            for (Category currentCategoryUnderStock : currentStock.getCategories()) {
                for (ModuleEntity currentModuleUnderCategory : currentCategoryUnderStock.getModuleEntities()) {
                    Instant currentInstant = currentModuleUnderCategory.getUpdatedDate();
                    if (currentInstant.isAfter(latestInstant)) {
                        latestInstant = currentInstant;
                    }
                }
            }
        }

        return latestInstant;
    }

    public Dashboard fetchDashboard(Integer userId) {
        return dashboardRepository.findById(userId).orElse(null);
    }

}
