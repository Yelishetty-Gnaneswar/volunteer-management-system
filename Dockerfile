# Use stable Java 17 image
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy Maven wrapper & pom.xml
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port (Spring Boot default)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/volunteer-management-system-0.0.1-SNAPSHOT.jar"]
