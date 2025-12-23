package com.infosys.volunteer.management.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.dto.EventRequestDto;
import com.infosys.volunteer.management.entity.Event;
import com.infosys.volunteer.management.entity.Registration;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.EventRepository;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.RegistrationService;
import com.infosys.volunteer.management.session.SessionManager;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository repo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final SessionManager sessionManager;

    public RegistrationServiceImpl(RegistrationRepository repo,
                                   EventRepository eventRepo,
                                   UserRepository userRepo,
                                   SessionManager sessionManager) {
        this.repo = repo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.sessionManager = sessionManager;
    }

    private User loggedUser(String sessionId) {
        String email = sessionManager.getEmailBySession(sessionId);
        if (email == null) {
            throw new RuntimeException("Invalid session");
        }
        return userRepo.findByEmailId(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================== REGISTER ==================
    @Override
    public void register(EventRequestDto req, String sessionId) {

        User user = loggedUser(sessionId);

        if (!"VOLUNTEER".equalsIgnoreCase(user.getUserRole())) {
            throw new RuntimeException("Only volunteer can register");
        }

        Event event = eventRepo.findById(req.eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // ✅ Allow registration ONLY for UPCOMING events
        LocalDate today = LocalDate.now();
        LocalDate start = event.getEventStartDate().toLocalDate();

        if (!today.isBefore(start)) {
            throw new RuntimeException(
                    "Registration allowed only for UPCOMING events"
            );
        }

        // prevent duplicate registration
        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setVolunteerId(user.getEmailId());
        key.setEventId(req.eventId);

        if (repo.existsById(key)) {
            throw new RuntimeException("Already registered");
        }

        Registration r = new Registration();
        r.setEventId(req.eventId);
        r.setVolunteerId(user.getEmailId());
        r.setStatus("REGISTERED");
        r.setCheckIn(false);

        repo.save(r);
    }

    // ================== UNREGISTER ==================
    @Override
    public void unregister(EventRequestDto req, String sessionId) {

        User user = loggedUser(sessionId);

        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setVolunteerId(user.getEmailId());
        key.setEventId(req.eventId);

        Registration r = repo.findById(key)
                .orElseThrow(() -> new RuntimeException("Not registered"));

        r.setStatus("WITHDRAWN");
        repo.save(r);
    }

    // ================== CHECK-IN ==================
    @Override
    public void checkIn(EventRequestDto req, String sessionId) {

        User user = loggedUser(sessionId);

        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setVolunteerId(user.getEmailId());
        key.setEventId(req.eventId);

        Registration r = repo.findById(key)
                .orElseThrow(() -> new RuntimeException("Not registered"));

        r.setCheckIn(true);
        repo.save(r);
    }

    // ================== FEEDBACK ==================
    @Override
    public void feedback(EventRequestDto req, String sessionId) {

        User user = loggedUser(sessionId);

        if (!"VOLUNTEER".equalsIgnoreCase(user.getUserRole())) {
            throw new RuntimeException("Only volunteer can give feedback");
        }

        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setVolunteerId(user.getEmailId());
        key.setEventId(req.eventId);

        Registration r = repo.findById(key)
                .orElseThrow(() -> new RuntimeException("Not registered"));

        if (!"REGISTERED".equals(r.getStatus())) {
            throw new RuntimeException(
                    "Withdrawn volunteer cannot give feedback"
            );
        }

        r.setRating(req.rating);
        repo.save(r);
    }

    // ================== PARTICIPANTS (ORGANISER ONLY) ==================
    @Override
    public Map<String, Object> participants(Integer eventId, String sessionId) {

        User organiser = loggedUser(sessionId);

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganiser().getEmailId()
                .equals(organiser.getEmailId())) {
            throw new RuntimeException(
                    "Only organiser can view participants"
            );
        }

        // ✅ SHOW ALL REGISTERED volunteers (not only checked-in)
        List<String> volunteers = repo.findAll().stream()
                .filter(r -> r.getEventId().equals(eventId))
                .filter(r -> "REGISTERED".equals(r.getStatus()))
                .map(Registration::getVolunteerId)
                .collect(Collectors.toList());

        return Map.of(
                "totalParticipants", volunteers.size(),
                "volunteers", volunteers
        );
    }
}
