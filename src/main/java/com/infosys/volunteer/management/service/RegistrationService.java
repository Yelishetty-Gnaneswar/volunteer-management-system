package com.infosys.volunteer.management.service;

import java.util.List;
import java.util.Map;

public interface RegistrationService {

    void register(Integer eventId, String sessionId);
    void unregister(Integer eventId, String sessionId);
    void checkIn(Integer eventId, String volunteerEmail, String sessionId);
    void feedback(Integer eventId, Float rating, String sessionId);
    Map<String, Object> participants(Integer eventId, String sessionId);
    List<Map<String, Object>> myRegistrations(String sessionId);

}
