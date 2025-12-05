package com.infosys.volunteer.management.dto;

public class EventRequestDto {

    /* ================= COMMON ================= */
    public Integer eventId;
    public String emailId;
    public String password;   // ✅ used for LOGIN
    public Float rating;

    /* ================= EVENT CREATE / UPDATE ================= */
    public String name;
    public String description;
    public String address;
    public String city;
    public String startDate;
    public String endDate;
    public Integer maximumAllowedRegistrations;
    public String organizer;
    public Boolean registrationAllowed;
}
