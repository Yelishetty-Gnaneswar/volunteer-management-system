package com.infosys.volunteer.management.controller;

import com.infosys.volunteer.management.dto.AuthDTO;
import com.infosys.volunteer.management.dto.ResetPasswordDTO;
import com.infosys.volunteer.management.service.UserService;
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

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {

                String sessionId = userService.login(authDTO);

                return ResponseEntity.ok(
                                Map.of(
                                                "status", "success",
                                                "sessionId", sessionId));
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(
                        @RequestHeader("sessionId") String sessionId) {

                userService.logout(sessionId);

                return ResponseEntity.ok(
                                Map.of("message", "Logged out"));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> reset(
                        @RequestBody ResetPasswordDTO dto) {

                userService.resetPassword(
                                dto.getEmailId(),
                                dto.getNewPassword());

                return ResponseEntity.ok("Password reset successful");
        }
}
