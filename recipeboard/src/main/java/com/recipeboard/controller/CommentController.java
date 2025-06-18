package com.recipeboard.controller;

import com.recipeboard.domain.Comment;
import com.recipeboard.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes/{recipeId}/comments")
public class CommentController {
    private final CommentService service;
    public CommentController(CommentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Comment> add(@PathVariable Long recipeId,
                                       @RequestParam Long userId,
                                       @RequestParam String content) {
        return ResponseEntity.ok(
                service.addComment(recipeId, userId, content)
        );
    }

    @GetMapping
    public ResponseEntity<List<Comment>> list(@PathVariable Long recipeId) {
        return ResponseEntity.ok(
                service.getComments(recipeId)
        );
    }
    
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> update(@PathVariable Long recipeId,
                                          @PathVariable Long commentId,
                                          @RequestParam Long userId,
                                          @RequestParam String content) {
        return ResponseEntity.ok(
                service.updateComment(commentId, userId, content)
        );
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long recipeId,
                                        @PathVariable Long commentId,
                                        @RequestParam Long userId) {
        service.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}