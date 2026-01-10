package com.infosys.volunteer.management.service.impl;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.dto.EventRequestDto;
import com.infosys.volunteer.management.dto.EventResponseDto;
import com.infosys.volunteer.management.entity.Event;
import com.infosys.volunteer.management.entity.Registration;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.EventRepository;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.EmailService;
import com.infosys.volunteer.management.service.EventService;
import com.infosys.volunteer.management.session.SessionManager;
import com.infosys.volunteer.management.util.EmailTemplateUtil;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final SessionManager sessionManager;
    private final RegistrationRepository registrationRepository;
    private final EmailService emailService;

    public EventServiceImpl(
            EventRepository eventRepo,
            UserRepository userRepo,
            SessionManager sessionManager,
            RegistrationRepository registrationRepository,
            EmailService emailService) {

        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.sessionManager = sessionManager;
        this.registrationRepository = registrationRepository;
        this.emailService = emailService;
    }

    /* ================= SESSION ================= */

    private User getLoggedInUser(String sessionId) {
        String email = sessionManager.getEmailBySession(sessionId);
        if (email == null) {
            throw new RuntimeException("Invalid session");
        }
        return userRepo.findByEmailId(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /* ================= STATUS ================= */

    private String getStatus(Event e) {
        LocalDate today = LocalDate.now();
        LocalDate start = e.getEventStartDate().toLocalDate();
        LocalDate end = e.getEventEndDate().toLocalDate();

        if (today.isBefore(start)) return "UPCOMING";
        if (!today.isAfter(end)) return "ONGOING";
        return "COMPLETED";
    }

    /* ================= CREATE ================= */

    @Override
    public Integer create(EventRequestDto req, String sessionId) {

        User organiser = getLoggedInUser(sessionId);

        Event e = new Event();
        e.setEventName(req.name);
        e.setDescription(req.description);
        e.setAddress(req.address);
        e.setCity(req.city);
        e.setEventStartDate(Date.valueOf(req.startDate));
        e.setEventEndDate(Date.valueOf(req.endDate));
        e.setMaxAllowedRegistrations(req.maximumAllowedRegistrations);
        e.setRegistrationAllowed(true);
        e.setOrganiser(organiser);

        Integer eventId = eventRepo.save(e).getEventId();

        emailService.sendHtmlEmail(
                organiser.getEmailId(),
                "Event Created – " + e.getEventName(),
                EmailTemplateUtil.load(
                        "event-created.html",
                        Map.of(
                                "userName", organiser.getEmailId(),
                                "eventName", e.getEventName(),
                                "startDate", e.getEventStartDate().toString(),
                                "endDate", e.getEventEndDate().toString(),
                                "eventLocation", e.getAddress() + ", " + e.getCity(),
                                "eventDescription", e.getDescription()
                        )
                )
        );

        return eventId;
    }

    /* ================= UPDATE ================= */

    @Override
    public void update(EventRequestDto req, String sessionId) {

        User organiser = getLoggedInUser(sessionId);

        Event e = eventRepo.findById(req.eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!e.getOrganiser().getEmailId().equals(organiser.getEmailId())) {
            throw new RuntimeException("Not your event");
        }

        if (req.name != null) e.setEventName(req.name);
        if (req.description != null) e.setDescription(req.description);
        if (req.address != null) e.setAddress(req.address);
        if (req.city != null) e.setCity(req.city);
        if (req.startDate != null) e.setEventStartDate(Date.valueOf(req.startDate));
        if (req.endDate != null) e.setEventEndDate(Date.valueOf(req.endDate));

        eventRepo.save(e);

        /* ===== ORGANISER EMAIL ===== */
        emailService.sendHtmlEmail(
                organiser.getEmailId(),
                "Event Updated – " + e.getEventName(),
                EmailTemplateUtil.load(
                        "event-updated-organiser.html",
                        Map.of(
                                "userName", organiser.getEmailId(),
                                "eventName", e.getEventName(),
                                "startDate", e.getEventStartDate().toString(),
                                "endDate", e.getEventEndDate().toString(),
                                "eventLocation", e.getAddress() + ", " + e.getCity()
                        )
                )
        );

        /* ===== VOLUNTEER EMAILS (✅ FIXED) ===== */
        for (Registration r : registrationRepository.findByEventId(e.getEventId())) {
            emailService.sendHtmlEmail(
                    r.getVolunteerId(),
                    "Event Updated – " + e.getEventName(),
                    EmailTemplateUtil.load(
                            "event-updated-volunteer.html",
                            Map.of(
                                    "userName", r.getVolunteerId(), // ✅ REQUIRED FIX
                                    "eventName", e.getEventName(),
                                    "startDate", e.getEventStartDate().toString(),
                                    "endDate", e.getEventEndDate().toString(),
                                    "eventLocation", e.getAddress() + ", " + e.getCity()
                            )
                    )
            );
        }
    }

    /* ================= DELETE ================= */

    @Override
    public void delete(Integer eventId, String sessionId) {

        User organiser = getLoggedInUser(sessionId);

        Event e = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        for (Registration r : registrationRepository.findByEventId(eventId)) {
            emailService.sendHtmlEmail(
                    r.getVolunteerId(),
                    "Event Cancelled – " + e.getEventName(),
                    EmailTemplateUtil.load(
                            "event-cancelled.html",
                            Map.of(
                                    "userName", r.getVolunteerId(),
                                    "messageLine",
                                    "The event you registered for has been cancelled by the organiser.",
                                    "eventName", e.getEventName(),
                                    "startDate", e.getEventStartDate().toString(),
                                    "endDate", e.getEventEndDate().toString(),
                                    "eventLocation", e.getAddress() + ", " + e.getCity()
                            )
                    )
            );
        }

        emailService.sendHtmlEmail(
                organiser.getEmailId(),
                "Event Cancelled – " + e.getEventName(),
                EmailTemplateUtil.load(
                        "event-cancelled.html",
                        Map.of(
                                "userName", organiser.getEmailId(),
                                "messageLine",
                                "You have successfully cancelled the event.",
                                "eventName", e.getEventName(),
                                "startDate", e.getEventStartDate().toString(),
                                "endDate", e.getEventEndDate().toString(),
                                "eventLocation", e.getAddress() + ", " + e.getCity()
                        )
                )
        );

        registrationRepository.deleteByEventId(eventId);
        eventRepo.deleteById(eventId);
    }

    /* ================= LIST ================= */

    @Override
    public List<EventResponseDto> listByStatus(String status) {
        return eventRepo.findAll().stream()
                .filter(e -> getStatus(e).equalsIgnoreCase(status))
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDto> listByStatusForVolunteer(
            String status, String sessionId) {

        getLoggedInUser(sessionId);

        return eventRepo.findAll().stream()
                .filter(e -> getStatus(e).equalsIgnoreCase(status))
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponseDto getById(Integer eventId) {
        return map(eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found")));
    }

    private EventResponseDto map(Event e) {
        EventResponseDto dto = new EventResponseDto();

        dto.eventId = e.getEventId();
        dto.name = e.getEventName();
        dto.description = e.getDescription();
        dto.address = e.getAddress();
        dto.city = e.getCity();
        dto.startDate = e.getEventStartDate().toString();
        dto.endDate = e.getEventEndDate().toString();

        // capacity
        dto.volunteersNeeded = e.getMaxAllowedRegistrations();
        dto.registrationAllowed = e.getRegistrationAllowed();

        // ⭐ ANALYTICS (THIS FIXES DONUTS)
        dto.registeredCount =
                registrationRepository.countRegistered(e.getEventId());

        dto.checkedInCount =
                registrationRepository.countCheckedIn(e.getEventId());

        dto.averageRating =
                registrationRepository.findAverageRating(e.getEventId());

        return dto;
    }
}

