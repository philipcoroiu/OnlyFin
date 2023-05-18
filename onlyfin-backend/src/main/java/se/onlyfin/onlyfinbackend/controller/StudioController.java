package se.onlyfin.onlyfinbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.DTO.LayoutDTO;
import se.onlyfin.onlyfinbackend.DTO.NameChangeDTO;
import se.onlyfin.onlyfinbackend.DTO.StockRefDTO;
import se.onlyfin.onlyfinbackend.model.User;
import se.onlyfin.onlyfinbackend.model.dashboard_entity.*;
import se.onlyfin.onlyfinbackend.repository.*;
import se.onlyfin.onlyfinbackend.service.UserService;

import java.security.Principal;
import java.time.Instant;
import java.util.*;

@CrossOrigin(origins = "localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/studio")
public class StudioController {
    private final UserService userService;
    private final StockRepository stockRepository;
    private final CategoryRepository categoryRepository;
    private final ModuleRepository moduleRepository;
    private final DashboardRepository dashboardRepository;
    private final StockRefRepository stockRefRepository;
    private final DashboardLayoutRepository dashboardLayoutRepository;

    public StudioController(UserService userService, StockRepository stockRepository,
                            CategoryRepository categoryRepository,
                            ModuleRepository moduleRepository,
                            DashboardRepository dashboardRepository,
                            StockRefRepository stockRefRepository,
                            DashboardLayoutRepository dashboardLayoutRepository) {
        this.userService = userService;
        this.stockRepository = stockRepository;
        this.categoryRepository = categoryRepository;
        this.moduleRepository = moduleRepository;
        this.dashboardRepository = dashboardRepository;
        this.stockRefRepository = stockRefRepository;
        this.dashboardLayoutRepository = dashboardLayoutRepository;
    }

    @PostMapping("/createStock")
    public ResponseEntity<String> createStock(@RequestBody StockRefDTO stockRefDTO, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());
        if (!Objects.equals(actingUser.getId(), stockRefDTO.dashboardId())) {
            return ResponseEntity.badRequest().build();
        }

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
    public ResponseEntity<?> deleteStock(@PathVariable Integer id, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        Stock targetStock = stockRepository.findById(id).orElse(null);
        if (targetStock == null) {
            return ResponseEntity.notFound().build();
        }

        if (actingUser.getId() != targetStock.getDashboard_id()) {
            return ResponseEntity.badRequest().build();
        }

        stockRepository.deleteById(id);

        return ResponseEntity.ok().body("stock deleted successfully");
    }

    @PostMapping("/createCategory")
    public ResponseEntity<?> createCategory(@RequestBody Category category, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        if (category.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        int targetDashboardId = category.getStock().getDashboard_id();
        if (actingUser.getId() != targetDashboardId) {
            return ResponseEntity.badRequest().build();
        }

        if (!stockRepository.existsById(category.getStock_id())) {
            return ResponseEntity.badRequest().body("there is no stock for that id");
        }

        categoryRepository.save(category);
        return ResponseEntity.ok(categoryRepository.getReferenceById(category.getId()));
    }

    /**
     * Creates a new category under a stock specified by id
     *
     * @param stockId           id of the target stock
     * @param nameOfNewCategory name of the new category to be created
     * @return name of new category if successful
     */
    @PostMapping("/createCategoryUsingStockId")
    public ResponseEntity<String> createCategoryUsingStockId(Integer stockId, String nameOfNewCategory, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        if (nameOfNewCategory.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Stock targetStock = stockRepository.findById(stockId).orElse(null);
        if (targetStock == null) {
            return ResponseEntity.badRequest().build();
        }

        if (actingUser.getId() != targetStock.getDashboard_id()) {
            return ResponseEntity.badRequest().build();
        }

        List<Category> currentCategories = new ArrayList<>(targetStock.getCategories());

        Category newCategory = new Category();
        newCategory.setName(nameOfNewCategory);
        currentCategories.add(newCategory);

        targetStock.setCategories(currentCategories);
        stockRepository.save(targetStock);

        return ResponseEntity.ok().body(newCategory.getName());
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        Category targetCategory = categoryRepository.findById(id).orElse(null);
        if (targetCategory == null) {
            return ResponseEntity.badRequest().build();
        }

        int targetDashboardId = targetCategory.getStock().getDashboard_id();
        if (actingUser.getId() != targetDashboardId) {
            return ResponseEntity.badRequest().build();
        }

        categoryRepository.deleteById(id);

        return ResponseEntity.ok().body("Removed category successfully");
    }

    @PutMapping("/updateCategoryName")
    public ResponseEntity<?> updateCategoryName(@RequestBody NameChangeDTO nameChangeRequest, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        if (nameChangeRequest.name().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Category category = categoryRepository.findById(nameChangeRequest.id()).orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().build();
        }

        int targetDashboardId = category.getStock().getDashboard_id();
        if (actingUser.getId() != targetDashboardId) {
            return ResponseEntity.badRequest().build();
        }

        category.setName(nameChangeRequest.name());
        categoryRepository.save(category);

        return ResponseEntity.ok().body(category);
    }

    @PostMapping("/createModule")
    public ResponseEntity<?> createModule(@RequestBody ModuleEntity moduleToSave) {

        if (!categoryRepository.existsById(moduleToSave.getCategory_id())) {
            return ResponseEntity.badRequest().body("there is no category for that id");
        }

        ModuleEntity savedModule = moduleRepository.save(moduleToSave);
        dashboardLayoutRepository.save(new DashboardLayout(savedModule.getId(), savedModule.getCategory_id()));
        return ResponseEntity.ok(savedModule);
    }

    @DeleteMapping("/deleteModule/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable Integer id, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        ModuleEntity targetModuleEntity = moduleRepository.findById(id).orElse(null);
        if (targetModuleEntity == null) {
            return ResponseEntity.notFound().build();
        }

        Category modulesCategory = targetModuleEntity.getCategory();
        int targetDashboardId = modulesCategory.getStock().getDashboard_id();
        if (actingUser.getId() != targetDashboardId) {
            return ResponseEntity.badRequest().build();
        }

        moduleRepository.deleteById(id);

        return ResponseEntity.ok().body("Removed module successfully");
    }

    @GetMapping("/getStocksAndCategories/{id}")
    public ResponseEntity<?> getStocksAndCategories(@PathVariable Integer id) {
        Dashboard dashboard = dashboardRepository.findById(id).orElse(null);
        if (dashboard == null) {
            return ResponseEntity.badRequest().body("can't find dashboard");
        }

        for (int i = 0; i < dashboard.getStocks().size(); i++) {
            for (int j = 0; j < dashboard.getStocks().get(i).getCategories().size(); j++) {
                dashboard.getStocks().get(i).getCategories().get(j).setModuleEntities(null);
            }
        }
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/getModuleFromId/{id}")
    public ResponseEntity<ModuleEntity> getModuleFromEntity(@PathVariable Integer id) {
        ModuleEntity targetModule = moduleRepository.findById(id).orElse(null);
        if (targetModule == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(targetModule);
    }

    @PutMapping("/updateModuleContent")
    public ResponseEntity<?> updateModuleContent(@RequestBody ModuleEntity module, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());
        int targetDashboardId = module.getCategory().getStock().getDashboard_id();
        if (actingUser.getId() != targetDashboardId) {
            return ResponseEntity.badRequest().build();
        }

        ModuleEntity moduleToUpdate = moduleRepository.findById(module.getId()).orElse(null);
        if (moduleToUpdate == null) {
            return ResponseEntity.badRequest().body("module id does not exist");
        }

        moduleToUpdate.setContent(module.getContent());
        moduleToUpdate.setUpdatedDate(Instant.now());
        moduleRepository.save(moduleToUpdate);

        return ResponseEntity.ok(moduleRepository.getReferenceById(module.getId()));
    }

    @PutMapping("/updateDashboardLayout")
    public ResponseEntity<List<DashboardLayout>> updateDashboardLayout(@RequestBody List<LayoutDTO> layoutDTOList, Principal principal) {
        User actingUser = userService.getUserOrException(principal.getName());

        List<DashboardLayout> responseLayout = new ArrayList<>();
        for (LayoutDTO tempLayout : layoutDTOList) {
            DashboardLayout currentDashboardLayout = dashboardLayoutRepository.findById(tempLayout.moduleId()).orElse(null);
            Category currentTargetCategory = categoryRepository.findById(tempLayout.categoryId()).orElse(null);
            if (currentDashboardLayout != null && currentTargetCategory != null) {
                int currentTargetDashboardId = currentTargetCategory.getStock().getDashboard_id();
                if (actingUser.getId() == currentTargetDashboardId) {
                    currentDashboardLayout.setH(tempLayout.h());
                    currentDashboardLayout.setW(tempLayout.w());
                    currentDashboardLayout.setY(tempLayout.y());
                    currentDashboardLayout.setX(tempLayout.x());

                    responseLayout.add(dashboardLayoutRepository.save(currentDashboardLayout));
                }
            }
        }

        return ResponseEntity.ok(responseLayout);
    }

}
