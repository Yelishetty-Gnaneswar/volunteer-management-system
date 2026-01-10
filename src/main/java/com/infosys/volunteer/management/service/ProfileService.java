package com.infosys.volunteer.management.service;

import com.infosys.volunteer.management.dto.ProfileDto;

public interface ProfileService {

    ProfileDto getMyProfile(String sessionId);

    void updateMyProfile(ProfileDto dto, String sessionId);
}
