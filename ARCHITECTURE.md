# Address Book Web Application — Architecture

## 1. Database Schema & Entity Mapping

### `Contact` Entity (JPA)

| Field         | Type         | Constraints                     | Description                     |
|---------------|--------------|----------------------------------|---------------------------------|
| `id`          | `Long`       | `@Id`, `@GeneratedValue`         | Primary key (auto-increment)    |
| `firstName`   | `String`     | `@NotBlank`, `@Size(max=50)`     | Required, max 50 chars          |
| `lastName`    | `String`     | `@NotBlank`, `@Size(max=50)`     | Required, max 50 chars          |
| `email`       | `String`     | `@NotBlank`, `@Email`, `@Size(max=100)` | Required, valid email format, max 100 chars |
| `phoneNumber` | `String`     | `@Size(max=20)`                  | Optional, max 20 chars          |
| `address`     | `String`     | `@Size(max=255)`                 | Optional, max 255 chars         |
| `category`    | `String`     | `@Size(max=50)`                  | Optional tag/category, max 50 chars |

- **Table name**: `contacts`
- **H2 Console**: Enabled at `/h2-console` for dev
- **Initial Data**: 5 sample contacts loaded via `CommandLineRunner` on startup

---

## 2. REST API Endpoints Specification

All endpoints are under base path `/api/contacts`.

### 2.1. Create Contact  
- **Method**: `POST`  
- **URL**: `/api/contacts`  
- **Request Body (JSON)**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-1234",
    "address": "123 Main St, Springfield",
    "category": "Friend"
  }
  ```
- **Response**:
  - `201 Created`: Returns created `Contact` with `id`
  - `400 Bad Request`: Validation errors (e.g., invalid email, missing required fields)

---

### 2.2. Get All Contacts  
- **Method**: `GET`  
- **URL**: `/api/contacts`  
- **Query Params (optional)**:
  - `search`: Filter by `firstName`, `lastName`, or `category` (case-insensitive substring match)
- **Response**:
  - `200 OK`: Array of `Contact` objects  
    ```json
    [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1-555-1234",
        "address": "123 Main St, Springfield",
        "category": "Friend"
      }
    ]
    ```

---

### 2.3. Get Contact by ID  
- **Method**: `GET`  
- **URL**: `/api/contacts/{id}`  
- **Response**:
  - `200 OK`: Single `Contact` object  
  - `404 Not Found`: If `id` does not exist

---

### 2.4. Update Contact  
- **Method**: `PUT`  
- **URL**: `/api/contacts/{id}`  
- **Request Body**: Full `Contact` payload (all fields required, even if unchanged)  
- **Response**:
  - `200 OK`: Updated `Contact`  
  - `400 Bad Request`: Validation errors  
  - `404 Not Found`: If `id` does not exist

---

### 2.5. Delete Contact  
- **Method**: `DELETE`  
- **URL**: `/api/contacts/{id}`  
- **Response**:
  - `204 No Content`: Successfully deleted  
  - `404 Not Found`: If `id` does not exist

---

## 3. Project Directory Layout (Maven Standard)

```
address-book/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── addressbook/
│   │   │               ├── AddressBookApplication.java          # Spring Boot main class
│   │   │               ├── model/
│   │   │               │   └── Contact.java                     # JPA entity
│   │   │               ├── repository/
│   │   │               │   └── ContactRepository.java           # Spring Data JPA repo
│   │   │               ├── service/
│   │   │               │   ├── ContactService.java              # Business logic
│   │   │               │   └── DataLoader.java                  # CommandLineRunner for sample data
│   │   │               └── controller/
│   │   │                   └── ContactController.java           # REST controller
│   │   └── resources/
│   │       ├── application.properties                           # DB, H2, logging config
│   │       └── data.sql                                         # Optional: fallback for initial data (not used; prefer DataLoader)
│   └── test/
│       └── java/
│           └── com/example/addressbook/
│               └── AddressBookApplicationTests.java
└── src/main/resources/static/
    ├── index.html                                               # Main frontend UI
    ├── css/
    │   └── styles.css                                           # Optional: custom CSS
    └── js/
        └── app.js                                               # Frontend JS (Fetch API, DOM manipulation)
```

> ✅ **Notes**:
> - Frontend is served as static resources from `src/main/resources/static/`.
> - All API responses use JSON.
> - Validation uses `javax.validation.constraints` (e.g., `@NotBlank`, `@Email`) and `@Valid` in controller.
> - Search is implemented server-side for simplicity and consistency (case-insensitive `LIKE` queries).
