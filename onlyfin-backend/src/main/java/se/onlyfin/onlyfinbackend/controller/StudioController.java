package se.onlyfin.onlyfinbackend.controller;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.LayoutDTO;
import se.onlyfin.onlyfinbackend.DTO.NameChangeDT;
import se.onlyfin.onlyfinbackend.DTO.StockRefDTO;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.*;
import se.onlyfin.onlyfinbackend.repository.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/studio")
public class StudioController {
    private final StockRepository stockRepository;
    private final CategoryRepository categoryRepository;
    private final ModuleRepository moduleRepository;
    private final DashboardRepository dashboardRepository;
    private final StockRefRepository stockRefRepository;
    private final DashboardLayoutRepository dashboardLayoutRepository;

    public StudioController(StockRepository stockRepository,
                            CategoryRepository categoryRepository,
                            ModuleRepository moduleRepository,
                            DashboardRepository dashboardRepository,
                            StockRefRepository stockRefRepository,
                            DashboardLayoutRepository dashboardLayoutRepository) {
        this.stockRepository = stockRepository;
        this.categoryRepository = categoryRepository;
        this.moduleRepository = moduleRepository;
        this.dashboardRepository = dashboardRepository;
        this.stockRefRepository = stockRefRepository;
        this.dashboardLayoutRepository = dashboardLayoutRepository;
    }

    @PostMapping("/createStock")
    public ResponseEntity<String> createStock(@RequestBody StockRefDTO stockRefDTO) {
        StockRef stockRef = stockRefRepository.findById(stockRefDTO.stockRefId()).orElse(null);
        if (stockRef == null) {
            return ResponseEntity.badRequest().build();
        }

        Stock stockToSave = new Stock();
        stockToSave.setStock_ref_id(stockRef);
        stockToSave.setDashboard_id(new Dashboard(stockRefDTO.dashboardId()));

        stockRepository.save(stockToSave);
        return ResponseEntity.ok().body("stock added successfully");
    }

    @DeleteMapping("/deleteStock/{id}")
    public ResponseEntity<?> deleteStock(@PathVariable Integer id) {

        if (!stockRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("There is no stock with that id");
        }

        stockRepository.deleteById(id);
        return ResponseEntity.ok().body("Removed stock successfully");
    }

    @PostMapping("/createCategory")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        int targetStockId = category.getStock_id();

        if (!stockRepository.existsById(targetStockId)) {
            return ResponseEntity.badRequest().body("there is no stock for that id");
        }

        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("There is no category with that id");
        }

        categoryRepository.deleteById(id);
        return ResponseEntity.ok().body("Removed category successfully");
    }

    @PutMapping("/updateCategoryName")
    public ResponseEntity<?> updateCategoryName(@RequestBody NameChangeDT nameChangeRequest) {
        int targetCategoryId = nameChangeRequest.id();

        Category targetCategory = categoryRepository.findById(targetCategoryId).orElse(null);
        if (targetCategory == null) {
            return ResponseEntity.badRequest().build();
        }

        targetCategory.setName(nameChangeRequest.name());

        Category savedCategory = categoryRepository.save(targetCategory);
        return ResponseEntity.ok().body(savedCategory);
    }

    @PostMapping("/createModule")
    public ResponseEntity<?> createModule(@RequestBody ModuleEntity moduleToSave) {
        int targetCategoryId = moduleToSave.getCategory_id();

        if (!categoryRepository.existsById(targetCategoryId)) {
            return ResponseEntity.badRequest().body("there is no category for that id");
        }

        ModuleEntity savedModule = moduleRepository.save(moduleToSave);
        DashboardLayout moduleDashboardLayout = new DashboardLayout(savedModule.getId(), savedModule.getCategory_id());
        dashboardLayoutRepository.save(moduleDashboardLayout);

        return ResponseEntity.ok(savedModule);
    }

    @DeleteMapping("/deleteModule/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable Integer id) {
        if (!moduleRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("There is no module with that id");
        }

        moduleRepository.deleteById(id);
        return ResponseEntity.ok().body("Removed module successfully");
    }

    @GetMapping("/getStocksAndCategories/{id}")
    public ResponseEntity<?> getStocksAndCategories(@PathVariable Integer id) {
        Dashboard targetDashboard = dashboardRepository.findById(id).orElse(null);
        if (targetDashboard == null) {
            return ResponseEntity.badRequest().body("cant find dashboard");
        }

        for (int i = 0; i < targetDashboard.getStocks().size(); i++) {
            for (int j = 0; j < targetDashboard.getStocks().get(i).getCategories().size(); j++) {
                targetDashboard.getStocks().get(i).getCategories().get(j).setModuleEntities(null);
            }
        }

        return ResponseEntity.ok(targetDashboard);
    }

    @GetMapping("/getModuleFromId/{id}")
    public ResponseEntity<ModuleEntity> getModuleFromEntity(@PathVariable Integer id) {
        ModuleEntity targetModuleEntity = moduleRepository.findById(id).orElse(null);
        if (targetModuleEntity == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(targetModuleEntity);
    }

    @PutMapping("/updateModuleContent")
    public ResponseEntity<?> updateModuleContent(@RequestBody ModuleEntity module) {
        ModuleEntity moduleToUpdate = moduleRepository.findById(module.getId()).orElse(null);
        if (moduleToUpdate == null) {
            return ResponseEntity.badRequest().body("module id does not exist");
        }

        moduleToUpdate.setContent(module.getContent());

        ModuleEntity savedModule = moduleRepository.save(moduleToUpdate);
        return ResponseEntity.ok(savedModule);
    }

    @PutMapping("/updateDashboardLayout")
    @Transactional
    public ResponseEntity<?> updateDashboardLayout(@RequestBody List<LayoutDTO> layoutDTOList) {
        List<DashboardLayout> responseLayout = new ArrayList<>();

        for (LayoutDTO tempLayout : layoutDTOList) {
            DashboardLayout currentLayout = dashboardLayoutRepository.findById(tempLayout.moduleId()).orElse(null);
            if (currentLayout != null) {
                currentLayout.setH(tempLayout.h());
                currentLayout.setW(tempLayout.w());
                currentLayout.setY(tempLayout.y());
                currentLayout.setX(tempLayout.x());

                DashboardLayout savedLayout = dashboardLayoutRepository.save(currentLayout);
                responseLayout.add(savedLayout);
            }
        }

        return ResponseEntity.ok(responseLayout);
    }

}