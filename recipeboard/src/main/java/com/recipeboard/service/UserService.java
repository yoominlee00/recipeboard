package com.recipeboard.service;

import com.recipeboard.domain.User;
import com.recipeboard.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    /** 회원가입 (비밀번호 평문 저장) */
    public User signup(String username, String password) {
        if (repo.findByUsername(username).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자입니다.");
        }
        User u = User.builder()
                .username(username)
                .password(password)   // 암호화 로직 제거
                .build();
        return repo.save(u);
    }

    /** 로그인 검증 (평문 비교) */
    public User login(String username, String password) {
        User u = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자가 없습니다."));
        if (!password.equals(u.getPassword())) {  // encoder.matches → equals로
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return u;
    }
}
