package com.infosys.volunteer.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;  // ✅ REQUIRED IMPORT

@EnableScheduling
@EnableAsync
@SpringBootApplication
public class VolunteerManagementSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(VolunteerManagementSystemApplication.class, args);
    }
}
