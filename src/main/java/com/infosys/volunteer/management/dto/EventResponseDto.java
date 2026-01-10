package com.infosys.volunteer.management.dto;

public class EventResponseDto {

    public Integer eventId;
    public String name;
    public String description;
    public String address;
    public String city;
    public String startDate;
    public String endDate;

    // EXISTING
    public Integer volunteersNeeded;       // capacity
    public Boolean registrationAllowed;
    public Float rating;
    public Boolean registered;              // current user registered?
    public Boolean checkIn;                 // current user checked-in?
    public String registrationStatus;

    // 🔥 ADD THESE (FOR ANALYTICS)
    public Integer registeredCount;         // total registered volunteers
    public Integer checkedInCount;// total checked-in volunteers
    public Double averageRating;

}


