# Use lightweight OpenJDK image
FROM eclipse-temurin:21-jdk-jammy


# Set working directory
WORKDIR /app

# Copy JAR file into container
COPY target/resume-screening-0.0.1-SNAPSHOT.jar app.jar

# Expose the app port
EXPOSE 8080

# Command to run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
