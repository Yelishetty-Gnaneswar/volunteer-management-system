package com.infosys.volunteer.management.service;

import java.util.Map;
import com.infosys.volunteer.management.dto.EventRequestDto;

public interface RegistrationService {
    void register(EventRequestDto req);
    void unregister(EventRequestDto req);
    void checkIn(EventRequestDto req);
    void feedback(EventRequestDto req);
    Map<String, Object> registrations(Integer eventId);
    Map<String, Object> participants(Integer eventId);
}
