package com.infosys.volunteer.management.service.impl;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.dto.*;
import com.infosys.volunteer.management.entity.Event;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.repository.EventRepository;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.EventService;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final RegistrationRepository registrationRepository;


    public EventServiceImpl(EventRepository eventRepo,
                            UserRepository userRepo,
                            RegistrationRepository registrationRepository) {
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.registrationRepository = registrationRepository;
    }


    @Override
    public Integer create(EventRequestDto req) {

        User organiser = userRepo.findById(req.organizer)
                .orElseThrow(() -> new RuntimeException("Organiser not found"));

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

    @Override
    public void update(EventRequestDto req) {

        Event e = eventRepo.findById(req.eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        e.setEventName(req.name);
        e.setAddress(req.address);
        e.setCity(req.city);
        e.setEventStartDate(Date.valueOf(req.startDate));
        e.setEventEndDate(Date.valueOf(req.endDate));
        e.setMaxAllowedRegistrations(req.maximumAllowedRegistrations);
        e.setRegistrationAllowed(req.registrationAllowed);

        eventRepo.save(e);
    }
    @Override
    public void delete(Integer eventId) {


        registrationRepository.deleteByEventId(eventId);

        eventRepo.deleteById(eventId);
    }


    @Override
    public List<EventResponseDto> listByStatus(String status) {
        boolean active = status.equalsIgnoreCase("active");
        return eventRepo.findByRegistrationAllowed(active)
                .stream().map(this::map).collect(Collectors.toList());
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
        dto.volunteersNeeded = e.getMaxAllowedRegistrations();
        dto.registrationAllowed = e.getRegistrationAllowed();
        dto.rating = e.getRating();
        return dto;
    }
}
