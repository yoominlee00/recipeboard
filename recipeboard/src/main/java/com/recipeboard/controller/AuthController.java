package com.recipeboard.controller;

import com.recipeboard.domain.User;
import com.recipeboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestParam String username,
                                       @RequestParam String password) {
        return ResponseEntity.ok(userService.signup(username, password));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam String username,
                                        @RequestParam String password) {
        User user = userService.login(username, password);
        
        // 사용자 정보를 Map으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("message", "로그인 성공");
        
        return ResponseEntity.ok(response);
    }
}