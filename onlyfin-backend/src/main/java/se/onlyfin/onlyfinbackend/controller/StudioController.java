package se.onlyfin.onlyfinbackend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.onlyfin.onlyfinbackend.model.NameChangeRequest;
import se.onlyfin.onlyfinbackend.model.dashboard.Category;
import se.onlyfin.onlyfinbackend.model.dashboard.ModuleEntity;
import se.onlyfin.onlyfinbackend.model.dashboard.Stock;
import se.onlyfin.onlyfinbackend.repository.CategoryRepository;
import se.onlyfin.onlyfinbackend.repository.ModuleRepository;
import se.onlyfin.onlyfinbackend.repository.StockRepository;

@RestController
@RequestMapping("/studio")
public class StudioController {

    @Autowired
    private StockRepository stockRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ModuleRepository moduleRepository;

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
    public ResponseEntity<?> createModule(@RequestBody JsonNode jsonModule){

        ModuleEntity module = new ModuleEntity();

        try{
            ObjectMapper objectMapper = new ObjectMapper();
            String contentAsString = objectMapper.writeValueAsString(jsonModule.get("content"));
            module.setContent(objectMapper.readTree(contentAsString));
        }  catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        module.setModule_type(jsonModule.get("module_type"));
        System.out.println("test4");
        module.setCategory_id(jsonModule.get("category_id"));

        System.out.println(module.getContent().asText());

        try{
            if(!categoryRepository.existsById(module.getCategory_id())) return ResponseEntity.badRequest().body("there is no category for that id");
            System.out.println("hej");
            moduleRepository.save(module);
            return ResponseEntity.ok(moduleRepository.getReferenceById(module.getId()));
        } catch (Exception e){ System.out.println(e.getMessage());}

        return ResponseEntity.badRequest().body("could not add module");
    }

    /*@DeleteMapping("/deleteModule/{id}")
    public String deleteModule(@PathVariable String id) {

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
    public ResponseEntity<?> updateModule(@RequestBody NameChangeRequest nameChangeRequest){

        System.out.println(nameChangeRequest.getId());
        System.out.println(nameChangeRequest.getName());
        Category category;

        if(categoryRepository.existsById(nameChangeRequest.getId())){
            category = categoryRepository.getReferenceById(nameChangeRequest.getId());
            category.setName(nameChangeRequest.getName());
            categoryRepository.save(category);
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.badRequest().body("category id does not exist");
    }*/
}
