# Address Book Web Application

Implement the Address Book Web Application step by step, following the instructions in `ARCHITECTURE.md`.

Based on `ARCHITECTURE.md`, I know:
- Backend: Spring Boot with Java 17+, JPA, H2, Validation
- Frontend: HTML/CSS/JS (no frameworks)
- REST API: `/api/contacts`
- Entity: `Contact` with fields: First Name, Last Name, Email, Phone, Address, Category/Tag

Let's implement all required files.

## Files to Implement

1. `pom.xml` with Spring Boot Starter Web, Data JPA, Validation, and H2 dependencies.
2. `src/main/resources/application.yml` configured for H2 in-memory DB and H2 console enabled.
3. Domain model: `Contact.java` entity with JPA annotations and Jakarta validation.
4. Repository: `ContactRepository.java` extending `JpaRepository`.
5. Service & Controller: `ContactService.java` and `ContactController.java` with REST endpoints.
6. Data initializer: `DataInitializer.java` to seed 5 sample contacts.
7. Frontend: `src/main/resources/static/index.html`, `styles.css`, and `app.js` providing a clean UI to view, add, edit, search, and delete contacts.

Ensure all imports are present and the backend compiles cleanly with `mvn spring-boot:run`.
