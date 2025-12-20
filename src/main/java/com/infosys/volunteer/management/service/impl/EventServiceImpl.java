package com.infosys.volunteer.management.service.impl;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.dto.EventRequestDto;
import com.infosys.volunteer.management.dto.EventResponseDto;
import com.infosys.volunteer.management.entity.Event;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.EventRepository;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.EventService;
import com.infosys.volunteer.management.session.SessionManager;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final SessionManager sessionManager;
    private final RegistrationRepository registrationRepository;


    public EventServiceImpl(EventRepository eventRepo,
                            UserRepository userRepo,
                            SessionManager sessionManager,
                            RegistrationRepository registrationRepository) {
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.sessionManager = sessionManager;
        this.registrationRepository = registrationRepository;
    }


    private User getLoggedInUser(String sessionId) {
        String email = sessionManager.getEmailBySession(sessionId);
        if (email == null) {
            throw new RuntimeException("Invalid session");
        }
        return userRepo.findByEmailId(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ CREATE EVENT (ORGANISER ONLY)
    @Override
    public Integer create(EventRequestDto req, String sessionId) {

        User organiser = getLoggedInUser(sessionId);

        String role = organiser.getUserRole().toUpperCase();
        if (!role.equals("ORGANIZER") && !role.equals("ORGANISER")) {
            throw new RuntimeException("Only organiser can create event");
        }

        Event e = new Event();
        e.setEventName(req.name);
        e.setDescription(req.description);
        e.setAddress(req.address);
        e.setCity(req.city);
        e.setEventStartDate(Date.valueOf(req.startDate));
        e.setEventEndDate(Date.valueOf(req.endDate));
        e.setMaxAllowedRegistrations(req.maximumAllowedRegistrations);
        e.setRegistrationAllowed(req.registrationAllowed);
        e.setOrganiser(organiser);

        return eventRepo.save(e).getEventId();
    }

    // ✅ UPDATE EVENT
    @Override
    public void update(EventRequestDto req, String sessionId) {

        User organiser = getLoggedInUser(sessionId);

        Event e = eventRepo.findById(req.eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!e.getOrganiser().getEmailId().equals(organiser.getEmailId())) {
            throw new RuntimeException("Not your event");
        }

        if (req.name != null)
            e.setEventName(req.name);

        if (req.description != null)
            e.setDescription(req.description);

        if (req.address != null)
            e.setAddress(req.address);

        if (req.city != null)
            e.setCity(req.city);

        if (req.startDate != null)
            e.setEventStartDate(Date.valueOf(req.startDate));

        if (req.endDate != null)
            e.setEventEndDate(Date.valueOf(req.endDate));

        if (req.maximumAllowedRegistrations != null)
            e.setMaxAllowedRegistrations(req.maximumAllowedRegistrations);

        if (req.registrationAllowed != null)
            e.setRegistrationAllowed(req.registrationAllowed);

        eventRepo.save(e);
    }


    @Override
    public void delete(Integer eventId, String sessionId) {

        User organiser = getLoggedInUser(sessionId);

        Event e = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!e.getOrganiser().getEmailId().equals(organiser.getEmailId())) {
            throw new RuntimeException("Not your event");
        }

        // ✅ delete child records first
        registrationRepository.deleteByEventId(eventId);

        // ✅ then delete parent
        eventRepo.deleteById(eventId);
    }

    // ✅ LIST EVENTS
    @Override
    public List<EventResponseDto> listByStatus(String status) {
        boolean active = status.equalsIgnoreCase("active");
        return eventRepo.findByRegistrationAllowed(active)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    // ✅ GET EVENT BY ID
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
        dto.volunteersNeeded = e.getMaxAllowedRegistrations();
        dto.registrationAllowed = e.getRegistrationAllowed();
        dto.rating = e.getRating();
        return dto;
    }
}
