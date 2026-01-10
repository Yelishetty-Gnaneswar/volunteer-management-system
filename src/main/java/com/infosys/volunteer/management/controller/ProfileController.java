package com.infosys.volunteer.management.controller;

import com.infosys.volunteer.management.dto.UserDTO;
import com.infosys.volunteer.management.service.UserService;
import com.infosys.volunteer.management.session.SessionManager;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final SessionManager sessionManager;

    public ProfileController(UserService userService,
                             SessionManager sessionManager) {
        this.userService = userService;
        this.sessionManager = sessionManager;
    }

    /* ================= GET PROFILE ================= */
    @GetMapping
    public UserDTO getProfile(@RequestHeader("sessionId") String sessionId) {

        String email =
                sessionManager.getEmailBySession(sessionId);

        if (email == null) {
            throw new RuntimeException("Invalid session");
        }

        return userService.getProfile(email);
    }

    /* ================= UPDATE PROFILE ================= */
    @PutMapping
    public String updateProfile(
            @RequestHeader("sessionId") String sessionId,
            @RequestBody UserDTO dto) {

        String email =
                sessionManager.getEmailBySession(sessionId);

        if (email == null) {
            throw new RuntimeException("Invalid session");
        }

        // 🔒 IMPORTANT: enforce identity
        dto.setEmailId(email);

        return userService.updateUser(dto);
    }
}
