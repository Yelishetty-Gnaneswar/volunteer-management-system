package com.infosys.volunteer.management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.volunteer.management.dto.UserDTO;
import com.infosys.volunteer.management.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.registerUser(userDTO));
    }

    // ✅ UPDATE USER
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(userDTO));
    }

    // ✅ RESET PASSWORD
    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.resetPassword(userDTO));
    }

    // ✅ GET PROFILE
    @GetMapping("/profile/{emailId}")
    public ResponseEntity<?> profile(@PathVariable String emailId) {
        return ResponseEntity.ok(userService.getProfile(emailId));
    }
}
