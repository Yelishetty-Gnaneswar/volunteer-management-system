package com.infosys.volunteer.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.infosys.volunteer.management.entity.Registration;

public interface RegistrationRepository
        extends JpaRepository<Registration, Registration.RegistrationKey> {

    @Transactional
    void deleteByEventId(Integer eventId);
}
