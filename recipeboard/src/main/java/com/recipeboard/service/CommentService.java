package com.recipeboard.service;

import com.recipeboard.domain.Comment;
import com.recipeboard.domain.Recipe;
import com.recipeboard.domain.User;
import com.recipeboard.repository.CommentRepository;
import com.recipeboard.repository.RecipeRepository;
import com.recipeboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepo;
    private final RecipeRepository  recipeRepo;
    private final UserRepository    userRepo;

    public CommentService(CommentRepository c, RecipeRepository r, UserRepository u) {
        this.commentRepo = c;
        this.recipeRepo  = r;
        this.userRepo    = u;
    }

    public Comment addComment(Long recipeId, Long userId, String content) {
        Recipe recipe = recipeRepo.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("레시피가 없습니다."));
        User   user   = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자가 없습니다."));
        Comment cm = Comment.builder()
                .recipe(recipe)
                .author(user)
                .content(content)
                .build();
        return commentRepo.save(cm);
    }

    public List<Comment> getComments(Long recipeId) {
        return commentRepo.findByRecipeId(recipeId);
    }
    
    public Comment updateComment(Long commentId, Long userId, String content) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
        
        // 작성자 확인
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("댓글 작성자만 수정할 수 있습니다.");
        }
        
        comment.setContent(content);
        return commentRepo.save(comment);
    }
    
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글이 없습니다."));
        
        // 작성자 확인
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("댓글 작성자만 삭제할 수 있습니다.");
        }
        
        commentRepo.delete(comment);
    }
}