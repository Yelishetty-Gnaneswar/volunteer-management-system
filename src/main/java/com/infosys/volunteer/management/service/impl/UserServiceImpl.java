package com.infosys.volunteer.management.service.impl;

import com.infosys.volunteer.management.dto.AuthDTO;
import com.infosys.volunteer.management.dto.UserDTO;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.UserService;
import com.infosys.volunteer.management.session.SessionManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionManager sessionManager;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           SessionManager sessionManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionManager = sessionManager;
    }

    @Override
    public String registerUser(UserDTO userDTO) {
        if (userDTO == null || userDTO.getEmailId() == null) {
            throw new IllegalArgumentException("Invalid user data");
        }
        if (userRepository.existsByEmailId(userDTO.getEmailId())) {
            throw new RuntimeException("User already exists with emailId: " + userDTO.getEmailId());
        }

        User user = new User();
        user.setEmailId(userDTO.getEmailId());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setPhoneNo(userDTO.getPhoneNo());
        user.setAddress(userDTO.getAddress());
        user.setUserRole(userDTO.getUserRole());

        userRepository.save(user);
        return "Success!";
    }

    @Override
    public String login(AuthDTO authDTO) {
        if (authDTO == null || authDTO.getEmailId() == null) {
            throw new IllegalArgumentException("Invalid login data");
        }

        Optional<User> opt = userRepository.findByEmailId(authDTO.getEmailId());
        User user = opt.orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String sessionId = sessionManager.createSession(user.getEmailId());
        return sessionId;
    }

    @Override
    public String updateUser(UserDTO userDTO) {
        if (userDTO == null || userDTO.getEmailId() == null) {
            throw new IllegalArgumentException("Invalid request");
        }
        Optional<User> opt = userRepository.findByEmailId(userDTO.getEmailId());
        User user = opt.orElseThrow(() -> new RuntimeException("User not found"));

        if (userDTO.getPhoneNo() != null) user.setPhoneNo(userDTO.getPhoneNo());
        if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
        if (userDTO.getUserRole() != null) user.setUserRole(userDTO.getUserRole());

        userRepository.save(user);
        return "Update successful";
    }

    @Override
    public String resetPassword(UserDTO userDTO) {
        if (userDTO == null || userDTO.getEmailId() == null) {
            throw new IllegalArgumentException("emailId is required");
        }
        // newPassword must be provided
        if (userDTO.getNewPassword() == null || userDTO.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("newPassword is required");
        }
        // oldPassword must be provided
        if (userDTO.getOldPassword() == null || userDTO.getOldPassword().isBlank()) {
            throw new IllegalArgumentException("oldPassword is required");
        }

        Optional<User> opt = userRepository.findByEmailId(userDTO.getEmailId());
        User user = opt.orElseThrow(() -> new RuntimeException("User not found"));

        // Verify old password matches stored (BCrypt)
        if (!passwordEncoder.matches(userDTO.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Everything OK — update to new password (hash it)
        user.setPassword(passwordEncoder.encode(userDTO.getNewPassword()));
        userRepository.save(user);
        return "Password reset successful";
    }


    @Override
    public UserDTO getProfile(String emailId) {
        if (emailId == null) throw new IllegalArgumentException("emailId required");
        Optional<User> opt = userRepository.findByEmailId(emailId);
        User user = opt.orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO resp = new UserDTO();
        resp.setEmailId(user.getEmailId());
        resp.setPhoneNo(user.getPhoneNo());
        resp.setAddress(user.getAddress());
        resp.setUserRole(user.getUserRole());
        return resp;
    }

    @Override
    public String logout(String sessionId) {
        if (sessionId == null || !sessionManager.isValidSession(sessionId)) {
            throw new RuntimeException("Invalid or expired session");
        }
        sessionManager.destroySession(sessionId);
        return "Logout successful";
    }
}
