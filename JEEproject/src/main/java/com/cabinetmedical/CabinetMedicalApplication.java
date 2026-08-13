package com.cabinetmedical;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;

@SpringBootApplication
public class CabinetMedicalApplication {

    public static void main(String[] args) {
        configureDatasourceFromAddon();
        SpringApplication.run(CabinetMedicalApplication.class, args);
    }

    /**
     * Mini Heroku injecte DATABASE_URL (format postgresql://user:pass@host:port/db)
     * quand un add-on PostgreSQL est attaché à l'app. On le traduit en propriétés
     * Spring DataSource. Sans DATABASE_URL, on garde la config locale (application.properties).
     */
    private static void configureDatasourceFromAddon() {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank() || !dbUrl.startsWith("postgresql://")) {
            return;
        }
        try {
            URI uri = URI.create(dbUrl);
            String userInfo = uri.getUserInfo();
            String user = (userInfo != null) ? userInfo.split(":", 2)[0] : "postgres";
            String pass = (userInfo != null && userInfo.contains(":"))
                    ? userInfo.split(":", 2)[1] : "";
            String host = uri.getHost();
            int port = (uri.getPort() > 0) ? uri.getPort() : 5432;
            String db = (uri.getPath() != null && uri.getPath().length() > 1)
                    ? uri.getPath().substring(1) : "postgres";
            System.setProperty("spring.datasource.url",
                    String.format("jdbc:postgresql://%s:%d/%s", host, port, db));
            System.setProperty("spring.datasource.username", user);
            System.setProperty("spring.datasource.password", pass);
            System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
            System.setProperty("spring.jpa.properties.hibernate.dialect",
                    "org.hibernate.dialect.PostgreSQLDialect");
        } catch (Exception e) {
            System.err.println("Failed to parse DATABASE_URL, using application.properties: " + e);
        }
    }
}