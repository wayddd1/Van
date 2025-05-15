FROM openjdk:17-jdk-slim

WORKDIR /app

COPY backend_web/VanEase/pom.xml .
COPY backend_web/VanEase/src ./src
COPY backend_web/VanEase/.mvn ./mvn
COPY backend_web/VanEase/.mvn/wrapper ./mvn/wrapper
COPY backend_web/VanEase/mvnw .

# Build the application
RUN ./mvnw clean package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

EXPOSE 8080

# Run the application
CMD ["java", "-cp", "target/dependency/*", "com.example.vanease.VanEase.VanEaseApplication"]