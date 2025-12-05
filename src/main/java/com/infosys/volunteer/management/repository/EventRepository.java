package com.infosys.volunteer.management.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.infosys.volunteer.management.entity.Event;

public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByRegistrationAllowed(boolean registrationAllowed);
}
