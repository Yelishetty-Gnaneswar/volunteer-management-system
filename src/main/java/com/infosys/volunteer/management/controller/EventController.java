package com.infosys.volunteer.management.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
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

        // 🔴 DATE VALIDATION
        ResponseEntity<?> dateValidation = validateDates(req);
        if (dateValidation != null) return dateValidation;

        return ResponseEntity.ok(
                Map.of("eventId", eventService.create(req, sessionId))
        );
    }

    // ✅ UPDATE EVENT (ORGANISER)
    @PutMapping("/update")
    public ResponseEntity<?> update(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        ResponseEntity<?> dateValidation = validateDates(req);
        if (dateValidation != null) return dateValidation;

        eventService.update(req, sessionId);
        return ResponseEntity.ok("Event updated successfully");
    }

    // ================== OTHER APIs (UNCHANGED) ==================

    @GetMapping("/list/status/{status}")
    public ResponseEntity<?> listByStatus(@PathVariable String status) {
        return ResponseEntity.ok(eventService.listByStatus(status));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.register(req, sessionId);
        return ResponseEntity.ok("Registered");
    }

    @PostMapping("/unregister")
    public ResponseEntity<?> unregister(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.unregister(req, sessionId);
        return ResponseEntity.ok("Unregistered");
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.checkIn(req, sessionId);
        return ResponseEntity.ok("Check-in successful");
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(
            @RequestHeader("Session-Id") String sessionId,
            @RequestBody EventRequestDto req) {

        registrationService.feedback(req, sessionId);
        return ResponseEntity.ok("Feedback saved");
    }

    @GetMapping("/{eventId}/participants")
    public Map<String, Object> participants(
            @RequestHeader("Session-Id") String sessionId,
            @PathVariable Integer eventId) {

        return registrationService.participants(eventId, sessionId);
    }

    @GetMapping("/list/id/{eventId}")
    public ResponseEntity<?> getById(@PathVariable Integer eventId) {
        return ResponseEntity.ok(eventService.getById(eventId));
    }

    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<?> delete(
            @RequestHeader("Session-Id") String sessionId,
            @PathVariable Integer eventId) {

        eventService.delete(eventId, sessionId);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // ================== DATE VALIDATION METHOD ==================

    private ResponseEntity<?> validateDates(EventRequestDto req) {
        try {
            if (req.startDate == null || req.endDate == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Start date and End date are required"));
            }

            LocalDate start = LocalDate.parse(req.startDate);
            LocalDate end = LocalDate.parse(req.endDate);

            if (start.isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Start date cannot be in the past"));
            }

            if (end.isBefore(start)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "End date must be after Start date"));
            }

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid date format. Use YYYY-MM-DD"));
        }

        return null; // ✅ valid
    }
}
