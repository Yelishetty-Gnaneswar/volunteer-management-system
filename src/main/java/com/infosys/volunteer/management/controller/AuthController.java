package com.infosys.volunteer.management.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.volunteer.management.dto.EventRequestDto;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ LOGIN (uses merged DTO)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EventRequestDto req,
                                   HttpSession session) {

        User user = userRepository.findById(req.emailId)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!user.getPassword().equals(req.password)) {
            throw new RuntimeException("Invalid password");
        }

        // 🔐 Create session
        session.setAttribute("USER_EMAIL", user.getEmailId());

        return ResponseEntity.ok(
                Map.of(
                        "status", "login success",
                        "sessionId", session.getId(),
                        "emailId", user.getEmailId()
                )
        );
    }

    // ✅ LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("status", "logout success"));
    }
}
