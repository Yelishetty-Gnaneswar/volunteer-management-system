package com.infosys.volunteer.management.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.volunteer.management.dto.EventRequestDto;
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

    // ✅ CREATE EVENT (ORGANISER)
    @PostMapping("/create")
    public ResponseEntity<?> create(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        return ResponseEntity.ok(
                Map.of("eventId", eventService.create(req, sessionId))
        );
    }

    // ✅ LIST EVENTS BY STATUS (PUBLIC)
    // Example: /event/list/status/active
    @GetMapping("/list/status/{status}")
    public ResponseEntity<?> listByStatus(@PathVariable String status) {
        return ResponseEntity.ok(eventService.listByStatus(status));
    }

    // ✅ REGISTER FOR EVENT (VOLUNTEER)
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.register(req, sessionId);
        return ResponseEntity.ok("Registered");
    }

    // ✅ UNREGISTER FROM EVENT (VOLUNTEER)
    @PostMapping("/unregister")
    public ResponseEntity<?> unregister(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.unregister(req, sessionId);
        return ResponseEntity.ok("Unregistered");
    }

    // ✅ CHECK-IN (VOLUNTEER)
    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.checkIn(req, sessionId);
        return ResponseEntity.ok("Check-in successful");
    }

    // ✅ FEEDBACK (VOLUNTEER)
    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.feedback(req, sessionId);
        return ResponseEntity.ok("Feedback saved");
    }

    // ✅ VIEW PARTICIPANTS (ORGANISER ONLY)
    @GetMapping("/{eventId}/participants")
    public Map<String, Object> participants(
            @RequestHeader("Session-Id") String sessionId,
            @PathVariable Integer eventId) {

        return registrationService.participants(eventId, sessionId);
    }
    // ✅ GET EVENT BY ID
    @GetMapping("/list/id/{eventId}")
    public ResponseEntity<?> getById(@PathVariable Integer eventId) {
        return ResponseEntity.ok(eventService.getById(eventId));
    }
    @PutMapping("/update")
    public ResponseEntity<?> update(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        eventService.update(req, sessionId);
        return ResponseEntity.ok("Event updated successfully");
    }
    // ✅ DELETE EVENT (ORGANISER ONLY)
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<?> delete(
            @RequestHeader("Session-Id") String sessionId,
            @PathVariable Integer eventId) {

        eventService.delete(eventId, sessionId);
        return ResponseEntity.ok("Event deleted successfully");
    }

}
