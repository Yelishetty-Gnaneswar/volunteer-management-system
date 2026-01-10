    package com.infosys.volunteer.management.service;

    import com.infosys.volunteer.management.dto.AuthDTO;
    import com.infosys.volunteer.management.dto.UserDTO;

    public interface UserService {

        String registerUser(UserDTO userDTO);

        String login(AuthDTO authDTO);

        String updateUser(UserDTO userDTO);

        // ✅ FIXED
        String resetPassword(String emailId, String newPassword);

        UserDTO getProfile(String emailId);

        String logout(String sessionId);
    }
