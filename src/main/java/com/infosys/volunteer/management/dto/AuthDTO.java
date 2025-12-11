package com.infosys.volunteer.management.dto;

public class AuthDTO {
    private String emailId;
    private String password;

    public AuthDTO() {}

    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
