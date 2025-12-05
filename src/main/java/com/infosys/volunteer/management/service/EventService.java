package com.infosys.volunteer.management.service;

import java.util.List;
import com.infosys.volunteer.management.dto.*;

public interface EventService {
    Integer create(EventRequestDto req);
    void update(EventRequestDto req);
    void delete(Integer eventId);
    List<EventResponseDto> listByStatus(String status);
    EventResponseDto getById(Integer eventId);
}
