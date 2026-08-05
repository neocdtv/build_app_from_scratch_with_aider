# Architecture Document: Address Book Web Application

This document outlines the technical design and structure for the Address Book Web Application.

## 1. Database Entity Mapping

The application uses an H2 in-memory database managed via Spring Data JPA. The core entity is the `Contact`.

### Entity: `Contact`

| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | Primary Key, Auto-increment | Unique identifier for the contact. |
| `firstName` | `String` | Not Null, Max 50 chars | Contact's given name. |
| `lastName` | `String` | Not Null, Max 50 chars | Contact's family name. |
| `email` | `String` | Not Null, Valid Email Format | Contact's email address. |
| `phoneNumber`| `String` | Not Null, Max 20 chars | Contact's phone number. |
| `address` | `String` | Max 255 chars | Physical mailing address. |
| `category` | `String` | Max 30 chars | Tag/Category (e.g., "Work", "Family"). |

## 2. REST API Specification

All endpoints are prefixed with `/api/contacts`. Responses will be returned in JSON format.

### Endpoints

| Method | URL | Description | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/contacts` | Retrieve all contacts (supports search) | N/A | `200 OK` + List of Contacts |
| `GET` | `/api/contacts/{id}` | Retrieve a specific contact | N/A | `200 OK` + Contact Object |
| `POST` | `/api/contacts` | Create a new contact | `ContactDTO` JSON | `201 Created` + Contact Object |
| `PUT` | `/api/contacts/{id}` | Update an existing contact | `ContactDTO` JSON | `200 OK` + Updated Contact |
| `DELETE` | `/api/contacts/{id}` | Remove a contact | N/A | `204 No Content` |

### Query Parameters
- `GET /api/contacts?search={query}`: Filters contacts by `firstName`, `lastName`, or `category`.

## 3. Project Directory Layout

The project follows the standard Maven directory structure.

```text
address-book/
├── pom.xml                           # Maven configuration and dependencies
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/addressbook/
│   │   │       ├── AddressBookApplication.java  # Spring Boot Entry Point
│   │   │       ├── controller/                  # REST Controllers
│   │   │       ├── service/                     # Business logic layer
│   │   │       ├── repository/                  # Spring Data JPA Repositories
│   │   │       ├── model/                       # JPA Entities
│   │   │       ├── dto/                         # Data Transfer Objects (for Validation)
│   │   │       └── exception/                   # Custom exception handling
│   │   └── resources/
│   │       ├── static/                          # Frontend Assets
│   │       │   ├── css/                         # Stylesheets (Tailwind/Vanilla)
│   │       │   ├── js/                          # Vanilla JavaScript (Fetch logic)
│   │       │   └── index.html                   # Main Application UI
│   │       └── application.properties           # H2 and Spring configuration
│   └── test/                                    # Unit and Integration tests
└── ARCHITECTURE.md                               # This document
```
