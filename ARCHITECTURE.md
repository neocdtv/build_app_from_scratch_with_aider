# Address Book Web Application - Architecture Documentation

## Section 1: Database Entity Mapping

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Long | `@Id`, `@GeneratedValue`, non-null | Primary key, auto-increment |
| `firstName` | String | `@NotBlank`, max 50 chars | Contact first name |
| `lastName` | String | `@NotBlank`, max 50 chars | Contact last name |
| `email` | String | `@NotBlank`, `@Email`, max 100 chars | Contact email address |
| `phoneNumber` | String | `@NotBlank`, max 20 chars | Contact phone number |
| `address` | String | `@NotBlank`, max 255 chars | Physical address |
| `category` | String | `@NotBlank`, max 50 chars | Tag/Category (e.g., Family, Work) |

**Entity Location:** `src/main/java/com/addressbook/model/Contact.java`

---

## Section 2: REST API Endpoints Specification

**Base Path:** `/api/contacts`

| HTTP Method | Endpoint | Request Body | Response Body | Description |
|-------------|----------|--------------|---------------|-------------|
| `GET` | `/api/contacts` | None | `[Contact]` (array) | List all contacts |
| `GET` | `/api/contacts/{id}` | None | `Contact` object | Get single contact by ID |
| `POST` | `/api/contacts` | `Contact` JSON | `Contact` object | Create new contact |
| `PUT` | `/api/contacts/{id}` | `Contact` JSON | `Contact` object | Update existing contact |
| `DELETE` | `/api/contacts/{id}` | None | `204 No Content` | Delete contact by ID |
| `GET` | `/api/contacts/search?q={query}` | None | `[Contact]` (array) | Search/filter by name or category |

### POST Request/Response Example

**Request:**
```json
POST /api/contacts
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1-555-1234",
  "address": "123 Main Street, Anytown, USA",
  "category": "Family"
}
```

**Response:**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1-555-1234",
  "address": "123 Main Street, Anytown, USA",
  "category": "Family"
}
```

---

## Section 3: Project Directory Layout

```
address-book/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/addressbook/
│   │   │   ├── AddressBookApplication.java
│   │   │   ├── config/DatabaseInitializer.java
│   │   │   ├── controller/ContactController.java
│   │   │   ├── model/Contact.java
│   │   │   ├── repository/ContactRepository.java
│   │   │   └── service/ContactService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── data.sql
│   │       └── static/ (index.html, css/, js/)
│   └── test/java/com/addressbook/
│       └── ContactControllerTest.java
└── ARCHITECTURE.md
```

---

## Section 4: Additional Notes

- **H2 Database Configuration:** In-memory or file-based configuration via `application.properties` for development and testing flexibility
- **Sample Data:** 5 sample contacts pre-populated in H2 database on startup via `data.sql` script
- **Validation:** Server-side validation using Spring `@Valid` annotations on controller method parameters with Bean Validation constraints
- **Frontend:** Vanilla JavaScript implementation using Fetch API for all CRUD operations, with client-side validation before API calls
