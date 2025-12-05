package com.infosys.volunteer.management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.volunteer.management.dto.*;
import com.infosys.volunteer.management.service.EventService;
import com.infosys.volunteer.management.service.RegistrationService;

@RestController
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;
    private final RegistrationService registrationService;

    public EventController(EventService eventService,
                           RegistrationService registrationService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody EventRequestDto req) {
        return ResponseEntity.ok(
                Map.of("Status", "created", "eventId", eventService.create(req))
        );
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody EventRequestDto req) {
        eventService.update(req);
        return ResponseEntity.ok(
                Map.of("Status", "updated successfully", "eventId", req.eventId)
        );
    }

    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<?> delete(@PathVariable Integer eventId) {
        eventService.delete(eventId);
        return ResponseEntity.ok("deleted");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody EventRequestDto req) {
        registrationService.register(req);
        return ResponseEntity.ok(Map.of("status", "registered"));
    }

    @PostMapping("/unregister")
    public ResponseEntity<?> unregister(@RequestBody EventRequestDto req) {
        registrationService.unregister(req);
        return ResponseEntity.ok(Map.of("status", "un-registered"));
    }


    @GetMapping("/list/status/{status}")
    public List<EventResponseDto> listByStatus(@PathVariable String status) {
        return eventService.listByStatus(status);
    }

    @GetMapping("/list/id/{eventId}")
    public EventResponseDto getById(@PathVariable Integer eventId) {
        return eventService.getById(eventId);
    }


    @GetMapping("/{eventId}/registrations")
    public Map<String, Object> registrations(@PathVariable Integer eventId) {
        return registrationService.registrations(eventId);
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(@RequestBody EventRequestDto req) {
        registrationService.checkIn(req);
        return ResponseEntity.ok(Map.of("Status", "check in successful"));
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(@RequestBody EventRequestDto req) {
        registrationService.feedback(req);
        return ResponseEntity.ok(
                Map.of("Status", "success", "Message", "Thanks for rating!")
        );
    }

    @GetMapping("/{eventId}/participants")
    public Map<String, Object> participants(@PathVariable Integer eventId) {
        return registrationService.participants(eventId);
    }
}
