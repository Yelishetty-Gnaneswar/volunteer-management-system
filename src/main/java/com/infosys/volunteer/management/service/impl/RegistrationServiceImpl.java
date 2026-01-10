package com.infosys.volunteer.management.service.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.entity.Event;
import com.infosys.volunteer.management.entity.Registration;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.EventRepository;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.EmailService;
import com.infosys.volunteer.management.service.RegistrationService;
import com.infosys.volunteer.management.session.SessionManager;
import com.infosys.volunteer.management.util.EmailTemplateUtil;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository repo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final SessionManager sessionManager;
    private final EmailService emailService;

    public RegistrationServiceImpl(
            RegistrationRepository repo,
            EventRepository eventRepo,
            UserRepository userRepo,
            SessionManager sessionManager,
            EmailService emailService) {

        this.repo = repo;
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.sessionManager = sessionManager;
        this.emailService = emailService;
    }

    /* ================= COMMON ================= */

    private User loggedUser(String sessionId) {
        String email = sessionManager.getEmailBySession(sessionId);
        if (email == null) throw new RuntimeException("Invalid session");
        return userRepo.findByEmailId(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String eventStatus(Event e) {
        LocalDate today = LocalDate.now();
        LocalDate start = e.getEventStartDate().toLocalDate();
        LocalDate end = e.getEventEndDate().toLocalDate();

        if (today.isBefore(start)) return "UPCOMING";
        if (!today.isAfter(end)) return "ONGOING";
        return "COMPLETED";
    }

    /* ================= REGISTER ================= */
    @Override
    public void register(Integer eventId, String sessionId) {

        User volunteer = loggedUser(sessionId);

        if (!"VOLUNTEER".equalsIgnoreCase(volunteer.getUserRole())) {
            throw new RuntimeException("Only volunteer can register");
        }

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Registration r = repo
                .findByVolunteerIdAndEventId(volunteer.getEmailId(), eventId)
                .orElseGet(() -> {
                    Registration nr = new Registration();
                    nr.setVolunteerId(volunteer.getEmailId());
                    nr.setEventId(eventId);
                    return nr;
                });

        r.setStatus("REGISTERED");
        r.setCheckIn(false);
        repo.save(r);

        User organiser = event.getOrganiser();

        /* ===== Volunteer Email ===== */
        emailService.sendHtmlEmail(
                volunteer.getEmailId(),
                "Registration Confirmed – " + event.getEventName(),
                EmailTemplateUtil.load(
                        "event-registered.html",
                        Map.of(
                                "userName", volunteer.getEmailId(),
                                "messageLine",
                                "Your registration for the following event has been confirmed.",
                                "eventName", event.getEventName(),
                                "startDate", event.getEventStartDate().toString(),
                                "endDate", event.getEventEndDate().toString(),
                                "eventLocation",
                                event.getAddress() + ", " + event.getCity(),
                                "volunteerEmail", volunteer.getEmailId()
                        )
                )
        );

        /* ===== Organiser Email ===== */
        emailService.sendHtmlEmail(
                organiser.getEmailId(),
                "New Volunteer Registered – " + event.getEventName(),
                EmailTemplateUtil.load(
                        "event-registered.html",
                        Map.of(
                                "userName", organiser.getEmailId(),
                                "messageLine",
                                "A volunteer has registered for your event.",
                                "eventName", event.getEventName(),
                                "startDate", event.getEventStartDate().toString(),
                                "endDate", event.getEventEndDate().toString(),
                                "eventLocation",
                                event.getAddress() + ", " + event.getCity(),
                                "volunteerEmail", volunteer.getEmailId()
                        )
                )
        );
    }

    /* ================= UNREGISTER ================= */
    @Override
    public void unregister(Integer eventId, String sessionId) {

        User volunteer = loggedUser(sessionId);

        Registration r = repo.findByVolunteerIdAndEventId(
                volunteer.getEmailId(), eventId
        ).orElseThrow(() -> new RuntimeException("Not registered"));

        r.setStatus("WITHDRAWN");
        repo.save(r);

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User organiser = event.getOrganiser();

        /* ===== Volunteer Email ===== */
        emailService.sendHtmlEmail(
                volunteer.getEmailId(),
                "Registration Cancelled – " + event.getEventName(),
                EmailTemplateUtil.load(
                        "event-unregistered.html",
                        Map.of(
                                "userName", volunteer.getEmailId(),
                                "messageLine",
                                "You have successfully unregistered from the event.",
                                "eventName", event.getEventName(),
                                "volunteerEmail", volunteer.getEmailId()
                        )
                )
        );

        /* ===== Organiser Email ===== */
        emailService.sendHtmlEmail(
                organiser.getEmailId(),
                "Volunteer Unregistered – " + event.getEventName(),
                EmailTemplateUtil.load(
                        "event-unregistered.html",
                        Map.of(
                                "userName", organiser.getEmailId(),
                                "messageLine",
                                "A volunteer has withdrawn from your event.",
                                "eventName", event.getEventName(),
                                "volunteerEmail", volunteer.getEmailId()
                        )
                )
        );
    }

    /* ================= CHECK-IN ================= */
    @Override
    public void checkIn(Integer eventId, String volunteerEmail, String sessionId) {

        User organiser = loggedUser(sessionId);

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganiser().getEmailId().equals(organiser.getEmailId())) {
            throw new RuntimeException("Not authorized");
        }

        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setVolunteerId(volunteerEmail);
        key.setEventId(eventId);

        Registration r = repo.findById(key)
                .orElseThrow(() -> new RuntimeException("Volunteer not registered"));

        r.setCheckIn(true);
        repo.save(r);
    }

    /* ================= PARTICIPANTS ================= */
    @Override
    public Map<String, Object> participants(Integer eventId, String sessionId) {

        loggedUser(sessionId);

        List<Registration> registrations = repo.findByEventId(eventId);

        List<String> volunteers = registrations.stream()
                .filter(r -> "REGISTERED".equalsIgnoreCase(r.getStatus()))
                .map(Registration::getVolunteerId)
                .collect(Collectors.toList());

        List<String> checkedIn = registrations.stream()
                .filter(r -> "REGISTERED".equalsIgnoreCase(r.getStatus()))
                .filter(r -> Boolean.TRUE.equals(r.getCheckIn()))
                .map(Registration::getVolunteerId)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("totalParticipants", volunteers.size());
        response.put("volunteers", volunteers);
        response.put("checkedIn", checkedIn);

        return response;
    }

    /* ================= FEEDBACK ================= */
    @Override
    public void feedback(Integer eventId, Float rating, String sessionId) {

        User user = loggedUser(sessionId);

        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setVolunteerId(user.getEmailId());
        key.setEventId(eventId);

        Registration r = repo.findById(key)
                .orElseThrow(() -> new RuntimeException("Not registered"));

        r.setRating(rating);
        repo.save(r);
    }

    /* ================= MY REGISTRATIONS ================= */
    @Override
    public List<Map<String, Object>> myRegistrations(String sessionId) {

        User user = loggedUser(sessionId);

        return repo.findAll().stream()
                .filter(r -> r.getVolunteerId().equals(user.getEmailId()))
                .filter(r -> "REGISTERED".equalsIgnoreCase(r.getStatus()))
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("eventId", r.getEventId());
                    map.put("rating", r.getRating());
                    return map;
                })
                .collect(Collectors.toList());
    }
}