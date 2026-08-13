# ── Build stage ─────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Dependencies (cache-friendly) puis source
COPY JEEproject/pom.xml .
COPY JEEproject/src ./src
RUN mvn -q -DskipTests package

# ── Runtime stage ───────────────────────────────────────
FROM eclipse-temurin:17-jre
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=docker
ENV PORT=8000

COPY --from=build /app/target/cabinet-medical-backend-1.0.0.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]