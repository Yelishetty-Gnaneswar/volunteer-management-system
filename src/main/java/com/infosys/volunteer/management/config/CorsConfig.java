package com.infosys.volunteer.management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

        @Bean
        public CorsFilter corsFilter() {

                CorsConfiguration config = new CorsConfiguration();

                // ✅ USE PATTERNS FOR WILDCARD SUPPORT (VERCEL/LOCAL)
                String allowedOrigins = System.getenv("ALLOWED_ORIGINS");
                if (allowedOrigins != null && !allowedOrigins.isBlank()) {
                        config.setAllowedOriginPatterns(List.of(allowedOrigins.split(",")));
                } else {
                        config.setAllowedOriginPatterns(List.of(
                                        "http://localhost:5173",
                                        "http://127.0.0.1:5173",
                                        "https://*.vercel.app"));
                }

                config.setAllowedMethods(List.of(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

                config.setAllowedHeaders(List.of("*"));

                // ✅ REQUIRED for session / cookies / headers
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return new CorsFilter(source);
        }
}
