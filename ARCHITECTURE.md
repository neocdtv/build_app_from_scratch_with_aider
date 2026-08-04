# Address Book Web Application - Architecture Specification

## 1. Database Entity Mapping (`Contact`)
The `Contact` entity will be mapped to a single `contacts` table using Spring Data JPA. All fields will use Bean Validation annotations for server-side enforcement.

| Field | Type | Constraints | JPA/Validation Annotations |
|-------|------|-------------|----------------------------|
| `id` | `Long` | Primary Key, Auto-generated | `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)` |
| `firstName` | `String` | NOT NULL, Max 50 chars | `@Column(nullable = false, length = 50)`, `@NotBlank`, `@Size(max = 50)` |
| `lastName` | `String` | NOT NULL, Max 50 chars | `@Column(nullable = false, length = 50)`, `@NotBlank`, `@Size(max = 50)` |
| `email` | `String` | UNIQUE, NOT NULL, Valid email format | `@Column(unique = true, nullable = false)`, `@Email`, `@NotBlank` |
| `phoneNumber` | `String` | UNIQUE, NOT NULL, E.164 format | `@Column(unique = true, nullable = false)`, `@Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")`, `@NotBlank` |
| `address` | `String` | Nullable, Max 255 chars | `@Column(length = 255)` |
| `category` | `String` | Nullable, Max 50 chars | `@Column(length = 50)` |
| `createdAt` | `LocalDateTime` | Auto-set on creation | `@Column(updatable = false)`, `@CreationTimestamp` |
| `updatedAt` | `LocalDateTime` | Auto-updated on modification | `@UpdateTimestamp` |

**DTOs:** Separate `ContactCreateDto` and `ContactUpdateDto` will be used for API payloads to enforce validation rules cleanly. `ContactUpdateDto` will allow null/empty fields for partial updates.

## 2. REST API Endpoints Specification
Base URL: `/api/contacts`
All endpoints return JSON. Standard HTTP status codes will be used. Global exception handling will return structured error responses (`{ "timestamp", "status", "error", "message" }`).

| Method | URL | Description | Request Body | Response | Status Codes |
|--------|-----|-------------|--------------|----------|--------------|
| `GET` | `/api/contacts` | List contacts with optional search/filter | Query params: `search` (matches firstName/lastName/category), `category` (exact match) | `List<ContactDto>` | 200 OK |
| `GET` | `/api/contacts/{id}` | Retrieve single contact by ID | Path variable: `id` | `ContactDto` | 200 OK, 404 Not Found |
| `POST` | `/api/contacts` | Create new contact | `ContactCreateDto` | `ContactDto` | 201 Created, 400 Bad Request |
| `PUT` | `/api/contacts/{id}` | Update existing contact | `ContactUpdateDto` | `ContactDto` | 200 OK, 400 Bad Request, 404 Not Found |
| `DELETE` | `/api/contacts/{id}` | Delete contact | Path variable: `id` | Empty body | 204 No Content, 404 Not Found |

**Search/Filter Logic:** `search` parameter will trigger a case-insensitive `LIKE` query across `firstName`, `lastName`, and `category`. `category` will filter by exact match. Both can be combined.

## 3. Project Directory Layout
Standard Maven structure under `src/main/java/com/example/addressbook/`:

```
src/
├── main/
│   ├── java/com/example/addressbook/
│   │   ├── AddressBookApplication.java
│   │   ├── config/
│   │   │   └── WebConfig.java          # CORS, static resource mapping
│   │   ├── controller/
│   │   │   └── ContactController.java  # REST endpoints
│   │   ├── service/
│   │   │   ├── ContactService.java     # Business logic
│   │   │   └── impl/ContactServiceImpl.java
│   │   ├── repository/
│   │   │   └── ContactRepository.java  # Spring Data JPA interface
│   │   ├── model/
│   │   │   ├── entity/Contact.java     # JPA Entity
│   │   │   └── dto/
│   │   │       ├── ContactCreateDto.java
│   │   │       ├── ContactUpdateDto.java
│   │   │       └── ContactDto.java
│   │   └── exception/
│   │       ├── GlobalExceptionHandler.java
│   │       └── ResourceNotFoundException.java
│   ├── resources/
│   │   ├── application.properties      # DB, JPA, server config
│   │   └── data.sql                    # Pre-population script (5 contacts)
│   └── webapp/                         # Or src/main/resources/static/
│       ├── index.html
│       ├── css/style.css
│       └── js/app.js
└── test/
    └── java/com/example/addressbook/   # Unit & integration tests
pom.xml
```

## 4. Initialization & Validation Strategy
- **Pre-population:** `data.sql` in `src/main/resources/` will insert 5 sample contacts on startup. `spring.sql.init.mode=always` will be set in `application.properties`.
- **Server-side Validation:** Enforced via `@Valid` on controller method parameters. Bean Validation annotations on DTOs handle format, length, and null checks.
- **Client-side Validation:** HTML5 `required`, `type="email"`, and `pattern` attributes on form inputs. Vanilla JS will perform async validation before `fetch()` calls and display inline error messages.
- **Frontend Architecture:** Single `index.html` with a dynamic contact list and modal form. Vanilla JS will handle DOM updates, form submission, and API calls using the Fetch API. No build step or framework required.
