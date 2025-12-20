package com.infosys.volunteer.management.service;

import java.util.List;
import com.infosys.volunteer.management.dto.*;

public interface EventService {
    Integer create(EventRequestDto req, String sessionId);
    void update(EventRequestDto req, String sessionId);
    void delete(Integer eventId, String sessionId);
    List<EventResponseDto> listByStatus(String status);
    EventResponseDto getById(Integer eventId);
}
