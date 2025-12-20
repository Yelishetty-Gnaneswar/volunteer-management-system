package com.infosys.volunteer.management.controller;

import com.infosys.volunteer.management.dto.AuthDTO;
import com.infosys.volunteer.management.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {

        if (authDTO.getEmailId() == null || authDTO.getPassword() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "error",
                            "message", "Email and password must not be null"
                    ));
        }

        String sessionId = userService.login(authDTO);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "sessionId", sessionId
                )
        );
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Session-Id") String sessionId) {

        userService.logout(sessionId);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "message", "Logged out successfully"
                )
        );
    }
}
