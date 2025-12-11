package com.infosys.volunteer.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_details")
public class User {

    @Id
    @Column(name = "Email_id", length = 100, nullable = false)
    private String emailId;

    @Column(name = "Password", length = 100, nullable = false)
    private String password;

    @Column(name = "Phone_No", length = 20, nullable = false)
    private String phoneNo;

    @Column(name = "Address", length = 255)
    private String address;

    @Column(name = "User_Role", length = 100, nullable = false)
    private String userRole;

    @Column(name = "Created_Time", insertable = false, updatable = false)
    private LocalDateTime createdTime;

    public User() {}

    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNo() { return phoneNo; }
    public void setPhoneNo(String phoneNo) { this.phoneNo = phoneNo; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public LocalDateTime getCreatedTime() { return createdTime; }
    public void setCreatedTime(LocalDateTime createdTime) { this.createdTime = createdTime; }
}
