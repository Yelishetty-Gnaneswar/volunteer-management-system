package com.infosys.volunteer.management.util;

import org.springframework.core.io.ClassPathResource;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Map;

public class EmailTemplateUtil {

    public static String load(String templateName, Map<String, String> values) {
        try {
            ClassPathResource resource =
                    new ClassPathResource("templates/email/" + templateName);

            String html = new String(
                    Files.readAllBytes(resource.getFile().toPath()),
                    StandardCharsets.UTF_8
            );

            for (Map.Entry<String, String> entry : values.entrySet()) {
                html = html.replace(
                        "{{" + entry.getKey() + "}}",
                        entry.getValue() == null ? "" : entry.getValue()
                );
            }
            return html;

        } catch (Exception e) {
            throw new RuntimeException("Unable to load email template", e);
        }
    }
}
