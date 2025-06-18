package com.recipeboard.service;

import com.recipeboard.domain.Recipe;
import com.recipeboard.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository repo;

    public RecipeService(RecipeRepository repo) {
        this.repo = repo;
    }

    public List<Recipe> findAll() {
        return repo.findAll();
    }

    public Recipe create(Recipe recipe) {
        return repo.save(recipe);
    }

    public Recipe findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다: " + id));
    }

    public Recipe update(Long id, Recipe newData) {
        Recipe existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다: " + id));
        
        // 작성자 확인 로직 제거 (프론트엔드에서 처리)
        
        existing.setTitle(newData.getTitle());
        existing.setContent(newData.getContent());
        existing.setImageUrl(newData.getImageUrl());
        existing.setCategory(newData.getCategory());
        // 작성자는 변경하지 않음
        return repo.save(existing);
    }

    public void delete(Long id) {
        Recipe recipe = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다: " + id));
        
        repo.deleteById(id);
    }
    
    // 작성자 확인을 위한 메서드 추가
    public void checkAuthor(Long id, String author) {
        Recipe recipe = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다: " + id));
        
        if (!recipe.getAuthor().equals(author)) {
            throw new RuntimeException("자신이 작성한 레시피만 수정/삭제할 수 있습니다.");
        }
    }
}