package com.infosys.volunteer.management.entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "registration_details")
@IdClass(Registration.RegistrationKey.class)
public class Registration {

    @Id
    @Column(name = "volunteer_id")
    private String volunteerId;

    @Id
    @Column(name = "event_id")
    private Integer eventId;

    private String status;

    @Column(name = "check_in")
    private Boolean checkIn;

    private Float rating;

    /* ========= GETTERS & SETTERS ========= */

    public String getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(String volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(Boolean checkIn) {
        this.checkIn = checkIn;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    /* ========= COMPOSITE KEY ========= */

    public static class RegistrationKey implements Serializable {

        private String volunteerId;
        private Integer eventId;

        public RegistrationKey() {}

        public String getVolunteerId() {
            return volunteerId;
        }

        public void setVolunteerId(String volunteerId) {
            this.volunteerId = volunteerId;
        }

        public Integer getEventId() {
            return eventId;
        }

        public void setEventId(Integer eventId) {
            this.eventId = eventId;
        }
    }
}
