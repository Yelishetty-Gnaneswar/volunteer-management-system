package com.infosys.volunteer.management.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

import com.infosys.volunteer.management.dto.EventActionDto;
import com.infosys.volunteer.management.dto.EventRegisterDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.volunteer.management.dto.EventRequestDto;
import com.infosys.volunteer.management.service.EventService;
import com.infosys.volunteer.management.service.RegistrationService;
import com.infosys.volunteer.management.session.SessionManager;

@RestController
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;
    private final RegistrationService registrationService;
    private final SessionManager sessionManager;

    public EventController(
            EventService eventService,
            RegistrationService registrationService,
            SessionManager sessionManager) {
        this.eventService = eventService;
        this.registrationService = registrationService;
        this.sessionManager = sessionManager;
    }

    // ================== CREATE EVENT ==================
    @PostMapping("/create")
    public ResponseEntity<?> create(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @RequestBody EventRequestDto req) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        ResponseEntity<?> dateValidation = validateDates(req);
        if (dateValidation != null) return dateValidation;

        Integer eventId = eventService.create(req, sessionId);
        return ResponseEntity.ok(Map.of("eventId", eventId));
    }

    // ================== UPDATE EVENT ==================
    @PutMapping("/update")
    public ResponseEntity<?> update(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @RequestBody EventRequestDto req) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        ResponseEntity<?> dateValidation = validateDates(req);
        if (dateValidation != null) return dateValidation;

        eventService.update(req, sessionId);
        return ResponseEntity.ok("Event updated successfully");
    }

    // ================== DELETE EVENT ==================
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<?> delete(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @PathVariable Integer eventId) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        eventService.delete(eventId, sessionId);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // ================== LIST EVENTS BY STATUS ==================
    @GetMapping("/list/status/{status}")
    public ResponseEntity<?> listByStatus(@PathVariable String status) {
        return ResponseEntity.ok(eventService.listByStatus(status));
    }

    // ================== REGISTER ==================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @RequestBody EventRegisterDto req) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        if (req == null || req.eventId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "eventId is required"));
        }

        registrationService.register(req.eventId, sessionId);
        return ResponseEntity.ok("Registered");
    }

    // ================== UNREGISTER ==================
    @PostMapping("/unregister")
    public ResponseEntity<?> unregister(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @RequestBody EventRegisterDto req) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        registrationService.unregister(req.eventId, sessionId);
        return ResponseEntity.ok("Unregistered");
    }

    // ================== ✅ CHECK-IN (FIXED) ==================
    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @RequestBody EventActionDto req) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        if (req.eventId == null || req.emailId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "eventId and emailId required"));
        }

        // ✅ PASS VOLUNTEER EMAIL
        registrationService.checkIn(req.eventId, req.emailId, sessionId);

        return ResponseEntity.ok("Check-in successful");
    }

    // ================== FEEDBACK ==================
    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @RequestBody EventActionDto req) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        registrationService.feedback(req.eventId, req.rating, sessionId);
        return ResponseEntity.ok("Feedback saved");
    }

    // ================== PARTICIPANTS ==================
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> participants(
            @RequestHeader(value = "sessionId", required = false) String sessionId,
            @PathVariable Integer eventId) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        return ResponseEntity.ok(
                registrationService.participants(eventId, sessionId)
        );
    }

    // ================== EVENT BY ID ==================
    @GetMapping("/list/id/{eventId}")
    public ResponseEntity<?> getById(@PathVariable Integer eventId) {
        return ResponseEntity.ok(eventService.getById(eventId));
    }

    // ================== MY REGISTRATIONS ==================
    @GetMapping("/my-registrations")
    public ResponseEntity<?> myRegistrations(
            @RequestHeader(value = "sessionId", required = false) String sessionId) {

        if (!sessionManager.isValidSession(sessionId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Invalid or expired session"));
        }

        return ResponseEntity.ok(
                registrationService.myRegistrations(sessionId)
        );
    }

    // ================== DATE VALIDATION ==================
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
        return null;
    }
}