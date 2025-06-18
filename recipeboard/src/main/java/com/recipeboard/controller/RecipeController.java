package com.recipeboard.controller;

import com.recipeboard.domain.Recipe;
import com.recipeboard.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
@CrossOrigin(origins = "*") // CORS 설정 추가
public class RecipeController {
    private final RecipeService service;

    public RecipeController(RecipeService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Recipe> create(@RequestBody Recipe recipe) {
        System.out.println("레시피 생성 요청: " + recipe.getTitle());
        return ResponseEntity.ok(service.create(recipe));
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> list() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> update(@PathVariable Long id,
                                       @RequestBody Recipe newData) {
        System.out.println("레시피 수정 요청: " + id + ", 제목: " + newData.getTitle());
        Recipe updated = service.update(id, newData);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                     @RequestParam(required = false) String author) {
        // 작성자 확인 (선택적)
        if (author != null) {
            service.checkAuthor(id, author);
        }
        
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}