package com.infosys.volunteer.management.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.dto.EventRequestDto;
import com.infosys.volunteer.management.entity.Registration;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.service.RegistrationService;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository repo;

    public RegistrationServiceImpl(RegistrationRepository repo) {
        this.repo = repo;
    }

    @Override
    public void register(EventRequestDto req) {
        Registration r = new Registration();
        r.setEventId(req.eventId);
        r.setVolunteerId(req.emailId);
        r.setStatus("REGISTERED");
        repo.save(r);
    }

    @Override
    public void unregister(EventRequestDto req) {
        Registration r = find(req);
        r.setStatus("WITHDRAWN");
        repo.save(r);
    }

    @Override
    public void checkIn(EventRequestDto req) {
        Registration r = find(req);
        r.setCheckIn(true);
        repo.save(r);
    }

    @Override
    public void feedback(EventRequestDto req) {
        Registration r = find(req);
        r.setRating(req.rating);
        repo.save(r);
    }

    @Override
    public Map<String, Object> registrations(Integer eventId) {
        List<String> users = repo.findAll().stream()
                .filter(r -> r.getEventId().equals(eventId))
                .filter(r -> "REGISTERED".equals(r.getStatus()))
                .map(Registration::getVolunteerId)
                .collect(Collectors.toList());

        return Map.of("totalRegistrations", users.size(), "Volunteers", users);
    }

    @Override
    public Map<String, Object> participants(Integer eventId) {
        List<String> users = repo.findAll().stream()
                .filter(r -> r.getEventId().equals(eventId))
                .filter(r -> Boolean.TRUE.equals(r.getCheckIn()))
                .map(Registration::getVolunteerId)
                .collect(Collectors.toList());

        return Map.of("totalParticipants", users.size(), "Volunteers", users);
    }

    private Registration find(EventRequestDto req) {
        Registration.RegistrationKey key = new Registration.RegistrationKey();
        key.setEventId(req.eventId);
        key.setVolunteerId(req.emailId);

        return repo.findById(key)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }
}
