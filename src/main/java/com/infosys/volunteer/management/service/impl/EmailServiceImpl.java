package com.infosys.volunteer.management.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.infosys.volunteer.management.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    // 🔔 Change this to your configured email
    private static final String FROM_EMAIL = "yelishettygnaneswar@gmail.com";

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /* ================= PLAIN TEXT EMAIL ================= */
    @Override
    @Async
    public void sendEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_EMAIL);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    /* ================= HTML EMAIL (TEMPLATES) ================= */
    @Override
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {

        try {
            MimeMessage message = mailSender.createMimeMessage();

            // UTF-8 is IMPORTANT for HTML templates
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(FROM_EMAIL);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }
}
