package se.onlyfin.onlyfinbackend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.model.dashboard.Dashboard;
import se.onlyfin.onlyfinbackend.model.dashboard.Stock;
import se.onlyfin.onlyfinbackend.repository.DashboardRepository;
import se.onlyfin.onlyfinbackend.repository.StockRepository;

import java.util.Optional;

@RestController
@RequestMapping("/dashboard")
public class dashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;
    private StockRepository stockRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Dashboard> getDashboard(@PathVariable String id) throws JsonProcessingException {

        System.out.println("hej");
        Optional<Dashboard> optionalDashboard = dashboardRepository.findById(id);
        Dashboard dashboard = optionalDashboard.orElse(null);
        System.out.println(dashboard.toString());
        if (dashboard == null) {
            System.out.println("is null");
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/stock/{id}")
    public String createStock(@RequestBody Stock stock){

        Stock savedStock = stockRepository.save(stock);
        if(savedStock != null){
            return "stock added to database";
        }
        return "stock could not be added";
    }
}
