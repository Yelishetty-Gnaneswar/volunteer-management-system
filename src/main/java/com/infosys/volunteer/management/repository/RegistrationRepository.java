package com.infosys.volunteer.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.infosys.volunteer.management.entity.Registration;

public interface RegistrationRepository
        extends JpaRepository<Registration, Registration.RegistrationKey> {

    // ================== DELETE ==================
    @Transactional
    void deleteByEventId(Integer eventId);

    // ================== FIND ==================
    List<Registration> findByEventId(Integer eventId);

    List<Registration> findByVolunteerId(String volunteerId);

    Optional<Registration> findByVolunteerIdAndEventId(
            String volunteerId,
            Integer eventId
    );

    boolean existsByVolunteerIdAndEventId(
            String volunteerId,
            Integer eventId
    );

    // ================== COUNTS ==================

    @Query("""
        SELECT COUNT(r)
        FROM Registration r
        WHERE r.eventId = :eventId
          AND r.status = 'REGISTERED'
    """)
    int countRegistered(Integer eventId);

    @Query("""
        SELECT COUNT(r)
        FROM Registration r
        WHERE r.eventId = :eventId
          AND r.status = 'REGISTERED'
          AND r.checkIn = true
    """)
    int countCheckedIn(Integer eventId);

    // ================== ⭐ FEEDBACK ==================
    // Average rating for COMPLETED events
    @Query("""
        SELECT AVG(r.rating)
        FROM Registration r
        WHERE r.eventId = :eventId
          AND r.rating IS NOT NULL
    """)
    Double findAverageRating(Integer eventId);
}
