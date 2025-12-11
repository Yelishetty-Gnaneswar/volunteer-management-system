package com.infosys.volunteer.management.session;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {

    private final Map<String, String> sessions = new ConcurrentHashMap<>();
    // key = sessionId, value = emailId

    public String createSession(String emailId) {
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, emailId);
        return sessionId;
    }

    public boolean isValidSession(String sessionId) {
        return sessionId != null && sessions.containsKey(sessionId);
    }

    public void destroySession(String sessionId) {
        if (sessionId != null) {
            sessions.remove(sessionId);
        }
    }

    public String getEmailBySession(String sessionId) {
        return sessions.get(sessionId);
    }
}
