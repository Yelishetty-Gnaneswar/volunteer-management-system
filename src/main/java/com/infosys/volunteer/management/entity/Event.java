package com.infosys.volunteer.management.entity;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "event_details")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "event_name", nullable = false)
    private String eventName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String description;

    @Column(name = "max_allowed_registrations", nullable = false)
    private Integer maxAllowedRegistrations;

    @Column(name = "event_start_date", nullable = false)
    private Date eventStartDate;

    @Column(name = "event_end_date", nullable = false)
    private Date eventEndDate;

    @Column(name = "registration_allowed", nullable = false)
    private Boolean registrationAllowed;

    private Float rating;

    @ManyToOne
    @JoinColumn(name = "organiser_id", nullable = false)
    private User organiser;

    /* ========= GETTERS & SETTERS ========= */

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaxAllowedRegistrations() {
        return maxAllowedRegistrations;
    }

    public void setMaxAllowedRegistrations(Integer maxAllowedRegistrations) {
        this.maxAllowedRegistrations = maxAllowedRegistrations;
    }

    public Date getEventStartDate() {
        return eventStartDate;
    }

    public void setEventStartDate(Date eventStartDate) {
        this.eventStartDate = eventStartDate;
    }

    public Date getEventEndDate() {
        return eventEndDate;
    }

    public void setEventEndDate(Date eventEndDate) {
        this.eventEndDate = eventEndDate;
    }

    public Boolean getRegistrationAllowed() {
        return registrationAllowed;
    }

    public void setRegistrationAllowed(Boolean registrationAllowed) {
        this.registrationAllowed = registrationAllowed;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public User getOrganiser() {
        return organiser;
    }

    public void setOrganiser(User organiser) {
        this.organiser = organiser;
    }

}
