package com.infosys.volunteer.management.scheduler;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.infosys.volunteer.management.entity.Event;
import com.infosys.volunteer.management.entity.Registration;
import com.infosys.volunteer.management.entity.User;
import com.infosys.volunteer.management.repository.EventRepository;
import com.infosys.volunteer.management.repository.RegistrationRepository;
import com.infosys.volunteer.management.repository.UserRepository;
import com.infosys.volunteer.management.service.EmailService;
import com.infosys.volunteer.management.util.EmailTemplateUtil;

@Component
public class EventReminderScheduler {

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private RegistrationRepository regRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService;

    // ✅ Production schedule: Every day at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendReminders() {

        LocalDate today = LocalDate.now();

        for (Event event : eventRepo.findAll()) {

            LocalDate startDate = event.getEventStartDate().toLocalDate();
            long daysLeft = ChronoUnit.DAYS.between(today, startDate);

            if (daysLeft < 0 || !(daysLeft == 3 || daysLeft == 1 || daysLeft == 0)) {
                continue;
            }

            String volunteerMessage =
                    daysLeft == 0 ? "🚨 The event you registered for starts today."
                            : daysLeft == 1 ? "⚠️ The event you registered for starts tomorrow."
                            : "⏳ The event you registered for starts in " + daysLeft + " days.";

            String organiserMessage =
                    daysLeft == 0 ? "🚨 The event you are conducting starts today."
                            : daysLeft == 1 ? "⚠️ The event you are conducting starts tomorrow."
                            : "⏳ The event you are conducting starts in " + daysLeft + " days.";

            // Organiser email
            User organiser = event.getOrganiser();
            emailService.sendHtmlEmail(
                    organiser.getEmailId(),
                    "Reminder – " + event.getEventName(),
                    EmailTemplateUtil.load(
                            "event-reminder.html",
                            Map.of(
                                    "userName", organiser.getEmailId(),
                                    "messageLine", organiserMessage,
                                    "eventName", event.getEventName(),
                                    "startDate", event.getEventStartDate().toString(),
                                    "endDate", event.getEventEndDate().toString(),
                                    "eventLocation", event.getAddress() + ", " + event.getCity()
                            )
                    )
            );

            // Volunteer emails
            for (Registration r : regRepo.findByEventId(event.getEventId())) {

                User volunteer =
                        userRepo.findById(r.getVolunteerId()).orElse(null);

                if (volunteer == null) continue;

                emailService.sendHtmlEmail(
                        volunteer.getEmailId(),
                        "Reminder – " + event.getEventName(),
                        EmailTemplateUtil.load(
                                "event-reminder.html",
                                Map.of(
                                        "userName", volunteer.getEmailId(),
                                        "messageLine", volunteerMessage,
                                        "eventName", event.getEventName(),
                                        "startDate", event.getEventStartDate().toString(),
                                        "endDate", event.getEventEndDate().toString(),
                                        "eventLocation", event.getAddress() + ", " + event.getCity()
                                )
                        )
                );
            }
        }
    }
}
