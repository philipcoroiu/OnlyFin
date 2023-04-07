package se.onlyfin.onlyfinbackend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.model.IdRequest;
import se.onlyfin.onlyfinbackend.model.dashboard.Dashboard;
import se.onlyfin.onlyfinbackend.model.dashboard.Stock;
import se.onlyfin.onlyfinbackend.repository.DashboardRepository;
import se.onlyfin.onlyfinbackend.repository.StockRepository;

import java.util.Optional;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getDashboard(@PathVariable String id) {

        try{
            int id_id = Integer.parseInt(id);
            Optional<Dashboard> optionalDashboard = dashboardRepository.findById(id_id);
            Dashboard dashboard = optionalDashboard.orElse(null);
            if (dashboard == null) {
                System.out.println("is null");
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(dashboard);
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        return ResponseEntity.badRequest().build();
    }
}
