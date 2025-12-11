package com.infosys.volunteer.management.controller;

import com.infosys.volunteer.management.dto.AuthDTO;
import com.infosys.volunteer.management.dto.UserDTO;
import com.infosys.volunteer.management.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.registerUser(userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        String sessionId = userService.login(authDTO);
        return ResponseEntity.ok().body("{\"sessionId\":\"" + sessionId + "\"}");
    }

    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(userDTO));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.resetPassword(userDTO));
    }

    @GetMapping("/profile/{emailId}")
    public ResponseEntity<UserDTO> profile(@PathVariable String emailId) {
        return ResponseEntity.ok(userService.getProfile(emailId));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Session-Id") String sessionId) {
        return ResponseEntity.ok(userService.logout(sessionId));
    }
}
