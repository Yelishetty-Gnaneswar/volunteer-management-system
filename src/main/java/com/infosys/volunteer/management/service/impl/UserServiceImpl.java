package com.infosys.volunteer.management.service.impl;

import com.infosys.volunteer.management.dto.AuthDTO;
import com.infosys.volunteer.management.dto.UserDTO;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.UserService;
import com.infosys.volunteer.management.session.SessionManager;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionManager sessionManager;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SessionManager sessionManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionManager = sessionManager;
    }

    /* ================= REGISTER ================= */
    @Override
    public String registerUser(UserDTO userDTO) {

        if (userDTO == null || userDTO.getEmailId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid user data");
        }

        if (userRepository.existsByEmailId(userDTO.getEmailId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "User already exists");
        }

        User user = new User();
        user.setEmailId(userDTO.getEmailId());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setPhoneNo(userDTO.getPhoneNo());
        user.setAddress(userDTO.getAddress());
        user.setName(userDTO.getName());
        user.setUserRole(userDTO.getUserRole().toUpperCase());

        userRepository.save(user);
        return "Registration successful";
    }

    /* ================= LOGIN ================= */
    @Override
    public String login(AuthDTO authDTO) {

        User user = userRepository.findByEmailId(authDTO.getEmailId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                authDTO.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return sessionManager.createSession(user.getEmailId());
    }

    /* ================= UPDATE PROFILE ================= */
    @Override
    public String updateUser(UserDTO userDTO) {

        User user = userRepository.findByEmailId(userDTO.getEmailId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"
                        )
                );

        if (userDTO.getName() != null) {
            user.setName(userDTO.getName());
        }
        if (userDTO.getPhoneNo() != null) {
            user.setPhoneNo(userDTO.getPhoneNo());
        }
        if (userDTO.getAddress() != null) {
            user.setAddress(userDTO.getAddress());
        }

        userRepository.save(user);
        return "Profile updated successfully";
    }

    /* ================= RESET PASSWORD (FIXED SAFELY) ================= */
    @Override
    public String resetPassword(String emailId, String newPassword) {

        if (emailId == null || newPassword == null || newPassword.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email and new password are required"
            );
        }

        User user = userRepository.findByEmailId(emailId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"
                        )
                );

        // 🚫 Prevent same password reset
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different from old password"
            );
        }

        // ✅ Proper hashing
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return "Password reset successful";
    }

    /* ================= PROFILE ================= */
    @Override
    public UserDTO getProfile(String emailId) {

        User user = userRepository.findByEmailId(emailId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"
                        )
                );

        UserDTO dto = new UserDTO();
        dto.setEmailId(user.getEmailId());
        dto.setName(user.getName());
        dto.setPhoneNo(user.getPhoneNo());
        dto.setAddress(user.getAddress());
        dto.setUserRole(user.getUserRole());

        return dto;
    }

    /* ================= LOGOUT ================= */
    @Override
    public String logout(String sessionId) {

        if (!sessionManager.isValidSession(sessionId)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid session"
            );
        }

        sessionManager.destroySession(sessionId);
        return "Logout successful";
    }
}
