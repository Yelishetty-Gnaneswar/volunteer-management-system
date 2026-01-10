package com.infosys.volunteer.management.controller;

import org.springframework.http.HttpStatus;
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

    // ✅ RESET PASSWORD (SAFE FIX)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody UserDTO userDTO) {

        if (userDTO == null ||
                userDTO.getEmailId() == null ||
                userDTO.getEmailId().trim().isEmpty() ||
                userDTO.getNewPassword() == null ||
                userDTO.getNewPassword().trim().isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email and new password are required");
        }

        String result = userService.resetPassword(
                userDTO.getEmailId().trim(),
                userDTO.getNewPassword().trim()
        );

        return ResponseEntity.ok(result);
    }

    // ✅ GET PROFILE
    @GetMapping("/profile/{emailId}")
    public ResponseEntity<?> profile(@PathVariable String emailId) {
        return ResponseEntity.ok(userService.getProfile(emailId));
    }
}
