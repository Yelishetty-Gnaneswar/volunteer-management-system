package com.infosys.volunteer.management.dto;

public class EventRequestDto {

    public Integer eventId;
    public String name;
    public String description;
    public String address;
    public String city;

    // Dates as String (YYYY-MM-DD)
    public String startDate;
    public String endDate;

    public Integer maximumAllowedRegistrations;
    public Boolean registrationAllowed;
    public Float rating;
}
