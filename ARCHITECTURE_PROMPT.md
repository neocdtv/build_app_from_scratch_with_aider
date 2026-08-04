I want to build a clean, production-ready Address Book Web Application.

### Tech Stack & Architecture
- Backend: Java 17+ with Spring Boot (Spring Web, Spring Data JPA, H2 Database, Validation)
- Frontend: Pure HTML5, CSS (vanilla or Tailwind CDN), and plain Vanilla JavaScript (Fetch API). No heavy frontend frameworks.
- Build Tool: Maven (`pom.xml`)
- API Design: RESTful JSON endpoints under `/api/contacts`

### Functional Requirements
1. CRUD operations for Contacts (First Name, Last Name, Email, Phone Number, Address, Category/Tag).
2. Instant search/filter by name or tag on the frontend.
3. Form validation (both client-side and Spring `@Valid` annotations server-side).
4. Pre-populate H2 database with 5 sample contacts on startup.

### Instructions for You
First, design the database schema and project folder structure. Write a comprehensive `ARCHITECTURE.md` file in the root directory detailing:
1. Database Entity mapping (`Contact` entity).
2. REST API endpoints specification (HTTP methods, URLs, request/response bodies).
3. Project directory layout (Maven standard layout).

Do NOT write the Java or HTML code yet--just generate `ARCHITECTURE.md`.