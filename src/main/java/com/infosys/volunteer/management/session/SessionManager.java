package com.infosys.volunteer.management.session;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {

    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public String createSession(String emailId) {
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, emailId);
        return sessionId;
    }

    public boolean isValidSession(String sessionId) {
        return sessionId != null && !sessionId.trim().isEmpty()
                && sessions.containsKey(sessionId.trim());
    }

    public void destroySession(String sessionId) {
        if (sessionId != null) {
            sessions.remove(sessionId.trim());
        }
    }

    public String getEmailBySession(String sessionId) {
        if (sessionId == null) return null;
        return sessions.get(sessionId.trim());
    }
}
