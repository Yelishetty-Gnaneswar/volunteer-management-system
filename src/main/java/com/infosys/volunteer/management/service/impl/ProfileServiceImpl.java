package com.infosys.volunteer.management.service.impl;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.dto.ProfileDto;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.ProfileService;
import com.infosys.volunteer.management.session.SessionManager;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepo;
    private final SessionManager sessionManager;

    public ProfileServiceImpl(UserRepository userRepo,
                              SessionManager sessionManager) {
        this.userRepo = userRepo;
        this.sessionManager = sessionManager;
    }

    /* ================= COMMON ================= */

    private User getLoggedInUser(String sessionId) {
        String email = sessionManager.getEmailBySession(sessionId);
        if (email == null) {
            throw new RuntimeException("Invalid session");
        }

        return userRepo.findByEmailId(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /* ================= GET PROFILE ================= */

    @Override
    public ProfileDto getMyProfile(String sessionId) {

        User user = getLoggedInUser(sessionId);

        ProfileDto dto = new ProfileDto();
        dto.emailId = user.getEmailId();
        dto.userRole = user.getUserRole();
        dto.phoneNo = user.getPhoneNo();
        dto.address = user.getAddress();

        return dto;
    }

    /* ================= UPDATE PROFILE ================= */

    @Override
    public void updateMyProfile(ProfileDto dto, String sessionId) {

        User user = getLoggedInUser(sessionId);

        // ✅ Update ONLY editable fields
        if (dto.phoneNo != null) {
            user.setPhoneNo(dto.phoneNo);
        }

        if (dto.address != null) {
            user.setAddress(dto.address);
        }

        userRepo.save(user);
    }
}
