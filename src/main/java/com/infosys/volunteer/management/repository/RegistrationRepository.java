package com.infosys.volunteer.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.infosys.volunteer.management.entity.Registration;
import org.springframework.transaction.annotation.Transactional;


public interface RegistrationRepository
        extends JpaRepository<Registration, Registration.RegistrationKey> {
    @Transactional
    void deleteByEventId(Integer eventId);

}
