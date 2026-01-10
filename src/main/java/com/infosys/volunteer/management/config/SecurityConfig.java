package com.infosys.volunteer.management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // ✅ EXISTING (UNCHANGED)
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/user/**",
                                "/event/**",

                                // ✅ ADDED (FIXES 403 PROFILE ISSUE)
                                "/api/profile/**"
                        ).permitAll()

                        // 🔒 EVERYTHING ELSE PROTECTED
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
