package com.infosys.volunteer.management.dto;

public class ProfileDto {

    // ===== READ-ONLY / IDENTIFICATION =====
    public String emailId;     // shown, not editable
    public String userRole;    // shown, not editable

    // ===== EDITABLE PROFILE FIELDS =====
    public String name;
    public String phoneNo;
    public String address;
}
