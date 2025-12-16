# Manuel d'Installation et de Déploiement

## Installation Locale

### Prérequis
1. **Java JDK 17** ou supérieur
   - Télécharger depuis: https://www.oracle.com/java/technologies/downloads/
   - Vérifier l'installation: `java -version`

2. **Maven 3.6+**
   - Télécharger depuis: https://maven.apache.org/download.cgi
   - Vérifier l'installation: `mvn -version`

3. **MySQL 8.0+** ou **PostgreSQL 12+**
   - MySQL: https://dev.mysql.com/downloads/mysql/
   - PostgreSQL: https://www.postgresql.org/download/

4. **IDE** (optionnel mais recommandé)
   - IntelliJ IDEA
   - Eclipse
   - VS Code avec extensions Java

### Étapes d'Installation

#### 1. Cloner ou Télécharger le Projet
```bash
cd C:\Users\aicha\Downloads\JEEproject
```

#### 2. Configurer la Base de Données MySQL

**Option A: Via MySQL Workbench ou ligne de commande**
```sql
CREATE DATABASE IF NOT EXISTS cabinet_medical;
USE cabinet_medical;
```

**Option B: La base sera créée automatiquement** (si l'utilisateur a les droits)

#### 3. Configurer application.properties

Ouvrir `src/main/resources/application.properties` et modifier:

```properties
# Pour MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/cabinet_medical?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE_MYSQL

# Pour PostgreSQL (alternative)
# spring.datasource.url=jdbc:postgresql://localhost:5432/cabinet_medical
# spring.datasource.username=postgres
# spring.datasource.password=VOTRE_MOT_DE_PASSE_POSTGRES
# spring.datasource.driver-class-name=org.postgresql.Driver
# spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

#### 4. Compiler le Projet

**Via Maven en ligne de commande:**
```bash
mvn clean install
```

**Via IDE:**
- IntelliJ IDEA: Clic droit sur `pom.xml` → Maven → Reload Project
- Puis: Run → Run 'CabinetMedicalApplication'

#### 5. Lancer l'Application

**Via Maven:**
```bash
mvn spring-boot:run
```

**Via IDE:**
- Exécuter la classe `CabinetMedicalApplication`

**Via JAR:**
```bash
mvn clean package
java -jar target/cabinet-medical-backend-1.0.0.jar
```

L'application sera accessible sur: `http://localhost:8080`

### Vérification de l'Installation

1. **Vérifier que le serveur démarre**
   - Console devrait afficher: "Started CabinetMedicalApplication"
   - Pas d'erreurs de connexion à la base de données

2. **Tester l'API**
   ```bash
   # Test de connexion
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"login":"admin","pwd":"password"}'
   ```

3. **Vérifier les données initiales**
   - Les comptes par défaut sont créés automatiquement
   - Les médicaments sont chargés automatiquement

## Comptes par Défaut

| Login | Mot de passe | Rôle |
|-------|--------------|------|
| admin | password | ADMINISTRATEUR |
| medecin1 | password | MEDECIN |
| secretaire1 | password | SECRETAIRE |

## Déploiement en Production

### 1. Préparer l'Environnement

**Variables d'environnement recommandées:**
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-server:3306/cabinet_medical
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password
export JWT_SECRET=very_secure_secret_key_minimum_256_bits
export JWT_EXPIRATION=86400000
```

### 2. Modifier application.properties pour Production

Créer `application-prod.properties`:
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

server.port=8080
```

### 3. Compiler pour Production

```bash
mvn clean package -DskipTests
```

### 4. Déployer sur Serveur

**Option A: Serveur Linux avec systemd**

Créer `/etc/systemd/system/cabinet-medical.service`:
```ini
[Unit]
Description=Cabinet Medical Backend
After=syslog.target

[Service]
User=appuser
ExecStart=/usr/bin/java -jar /opt/cabinet-medical/cabinet-medical-backend-1.0.0.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Démarrer le service:
```bash
sudo systemctl enable cabinet-medical
sudo systemctl start cabinet-medical
sudo systemctl status cabinet-medical
```

**Option B: Docker**

Créer `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/cabinet-medical-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build et run:
```bash
docker build -t cabinet-medical-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/cabinet_medical \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=password \
  cabinet-medical-backend
```

**Option C: Cloud (Heroku, AWS, Azure)**

1. Créer un compte sur la plateforme
2. Configurer la base de données
3. Déployer le JAR ou utiliser Maven plugin
4. Configurer les variables d'environnement

### 5. Configuration du Reverse Proxy (Nginx)

Exemple de configuration Nginx:
```nginx
server {
    listen 80;
    server_name api.cabinet-medical.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Dépannage

### Problème: Erreur de connexion à la base de données
- Vérifier que MySQL/PostgreSQL est démarré
- Vérifier les identifiants dans `application.properties`
- Vérifier que la base de données existe

### Problème: Port 8080 déjà utilisé
- Changer le port dans `application.properties`: `server.port=8081`
- Ou arrêter le processus utilisant le port 8080

### Problème: Erreur de compilation Maven
- Vérifier la version de Java: `java -version` (doit être 17+)
- Nettoyer le cache Maven: `mvn clean`
- Supprimer le dossier `target/` et recompiler

### Problème: Données non initialisées
- Vérifier les logs au démarrage
- Vérifier que `DataInitializer` est exécuté
- Vérifier les droits d'accès à la base de données

## Maintenance

### Sauvegarde de la Base de Données

**MySQL:**
```bash
mysqldump -u root -p cabinet_medical > backup_$(date +%Y%m%d).sql
```

**PostgreSQL:**
```bash
pg_dump -U postgres cabinet_medical > backup_$(date +%Y%m%d).sql
```

### Mise à Jour

1. Arrêter l'application
2. Sauvegarder la base de données
3. Remplacer le JAR
4. Redémarrer l'application

### Logs

Les logs sont affichés dans la console. Pour production, configurer un système de logging:
- Logback avec fichiers rotatifs
- Intégration avec ELK Stack
- Cloud logging (CloudWatch, Azure Monitor)

## Support

Pour toute question ou problème:
1. Vérifier les logs de l'application
2. Vérifier la documentation dans `README.md`
3. Consulter les issues GitHub (si applicable)


