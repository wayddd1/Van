FROM maven:3.8.4-openjdk-17-slim as build

WORKDIR /app

COPY backend_web/VanEase/pom.xml .
COPY backend_web/VanEase/src ./src

# Build the application
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]