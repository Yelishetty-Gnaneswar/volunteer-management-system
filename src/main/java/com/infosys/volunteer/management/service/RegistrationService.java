package com.infosys.volunteer.management.service;

import java.util.Map;
import com.infosys.volunteer.management.dto.EventRequestDto;

public interface RegistrationService {
    void register(EventRequestDto req, String sessionId);
    void unregister(EventRequestDto req, String sessionId);
    void checkIn(EventRequestDto req, String sessionId);
    void feedback(EventRequestDto req, String sessionId);
    Map<String, Object> participants(Integer eventId, String sessionId);
}
