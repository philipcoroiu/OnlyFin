package se.onlyfin.onlyfinbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.model.NameChangeRequest;
import se.onlyfin.onlyfinbackend.model.dashboard.Category;
import se.onlyfin.onlyfinbackend.model.dashboard.ModuleEntity;
import se.onlyfin.onlyfinbackend.model.dashboard.Stock;
import se.onlyfin.onlyfinbackend.repository.*;

@RestController
@RequestMapping("/studio")
public class StudioController {

    private final StockRepository stockRepository;
    private final CategoryRepository categoryRepository;
    private final ModuleRepository moduleRepository;

    public StudioController(StockRepository stockRepository, CategoryRepository categoryRepository, ModuleRepository moduleRepository) {
        this.stockRepository = stockRepository;
        this.categoryRepository = categoryRepository;
        this.moduleRepository = moduleRepository;
    }

    @PostMapping("/createStock")
    public String createStock(@RequestBody Stock stock){

        try{
            stockRepository.save(stock);
            return "stock added successfully";
        } catch (Exception e){ System.out.println(e.getMessage());}

        return "could not add stock";
    }

    @DeleteMapping("/deleteStock/{id}")
    public String deleteStock(@PathVariable String id) {

        try {
            int intId = Integer.parseInt(id);
            if(!stockRepository.existsById(intId)) {
                return "There is no stock with that id";
            }
            stockRepository.deleteById(intId);
            return "Removed stock successfully";
        } catch (Exception e) {
            System.out.println(e);
        }
        return "Could not remove stock";
    }

    @PostMapping("/createCategory")
    public ResponseEntity<?> createCategory(@RequestBody Category category){

        try{
            if(!stockRepository.existsById(category.getStock_id())) return ResponseEntity.badRequest().body("there is no stock for that id");

            categoryRepository.save(category);
            return ResponseEntity.ok(categoryRepository.getReferenceById(category.getId()));
        } catch (Exception e){ System.out.println(e.getMessage());}

        return ResponseEntity.badRequest().body("could not add category");
    }

    @DeleteMapping("/deleteCategory/{id}")
    public String deleteCategory(@PathVariable String id) {

        try {
            int intId = Integer.parseInt(id);
            if (!categoryRepository.existsById(intId)) {
                return "There is no category with that id";
            }
            categoryRepository.deleteById(intId);
            return "Removed category successfully";
        } catch (Exception e) {
            System.out.println(e);
        }
        return "Could not remove category";
    }

    @PutMapping("/updateCategoryName")
    public ResponseEntity<?> updateCategoryName(@RequestBody NameChangeRequest nameChangeRequest){

        Category category;

        if(categoryRepository.existsById(nameChangeRequest.getId())){
            category = categoryRepository.getReferenceById(nameChangeRequest.getId());
            category.setName(nameChangeRequest.getName());
            categoryRepository.save(category);
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.badRequest().body("category id does not exist");
    }

    @PostMapping("/createModule")
    public ResponseEntity<?> createModule(@RequestBody ModuleEntity moduleToSave){

        try{
            if(!categoryRepository.existsById(moduleToSave.getCategory_id())) return ResponseEntity.badRequest().body("there is no category for that id");

            moduleRepository.save(moduleToSave);
            return ResponseEntity.ok(moduleRepository.getReferenceById(moduleToSave.getId()));
        } catch (Exception e){ System.out.println(e.getMessage());}

        return ResponseEntity.badRequest().body("could not add module");
    }

    @DeleteMapping("/deleteModule/{id}")
    public String deleteModule(@PathVariable String id) {

        try {
            int intId = Integer.parseInt(id);
            if (!moduleRepository.existsById(intId)) {
                return "There is no module with that id";
            }
            moduleRepository.deleteById(intId);
            return "Removed module successfully";
        } catch (Exception e) {
            System.out.println(e);
        }
        return "Could not module category";
    }

    /*@PutMapping("/updateModuleContent")
    public ResponseEntity<?> updateModuleContent(@RequestBody ContentChangeRequest ccr){

        ModuleEntity module;

        if(moduleRepository.existsById(ccr.getId())){
            module = moduleRepository.getReferenceById(ccr.getId());
            module.setContent(ccr.getContent());
            moduleRepository.save(module);
            return ResponseEntity.ok(module);
        }
        return ResponseEntity.badRequest().body("module id does not exist");
    }*/
}