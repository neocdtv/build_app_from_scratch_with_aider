Read ARCHITECTURE.md and implement the complete application step by step.

Please generate all necessary files:
1. `pom.xml` with Spring Boot Starter Web, Data JPA, Validation, and H2 dependencies.
2. `src/main/resources/application.yml` configured for H2 in-memory DB and H2 console enabled.
3. Domain model: `Contact.java` entity with JPA annotations and Jakarta validation.
4. Repository: `ContactRepository.java` extending `JpaRepository`.
5. Service & Controller: `ContactService.java` and `ContactController.java` with REST endpoints.
6. Data initializer: `DataInitializer.java` to seed 5 sample contacts.
7. Frontend: `src/main/resources/static/index.html`, `styles.css`, and `app.js` providing a clean UI to view, add, edit, search, and delete contacts.

Ensure all imports are present and the backend compiles cleanly with `mvn spring-boot:run`.