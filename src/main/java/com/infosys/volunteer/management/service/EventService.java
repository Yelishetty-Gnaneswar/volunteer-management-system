package com.infosys.volunteer.management.service;
import com.infosys.volunteer.management.dto.EventResponseDto;
import java.util.List;
import com.infosys.volunteer.management.dto.*;

public interface EventService {

    Integer create(EventRequestDto req, String sessionId);

    void update(EventRequestDto req, String sessionId);

    void delete(Integer eventId, String sessionId);

    // status = UPCOMING | ONGOING | COMPLETED
    List<EventResponseDto> listByStatus(String status);

    EventResponseDto getById(Integer eventId);
    List<EventResponseDto> listByStatusForVolunteer(
            String status,
            String sessionId
    );

}
