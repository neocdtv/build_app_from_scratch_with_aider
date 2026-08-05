# Address Book Web Application

A simple web application for managing contacts with a Spring Boot backend and vanilla JavaScript frontend.

## Features

- View all contacts
- Add new contacts
- Edit existing contacts
- Delete contacts
- Search contacts by name or category
- Filter contacts by category

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Getting Started

1. Clone the repository
2. Build the project: `mvn clean install`
3. Run the application: `mvn spring-boot:run`
4. Open your browser and navigate to `http://localhost:8080`

## API Endpoints

- `GET /api/contacts` - Get all contacts (supports search and category filters)
- `GET /api/contacts/{id}` - Get a specific contact
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/{id}` - Update an existing contact
- `DELETE /api/contacts/{id}` - Delete a contact

## Database

The application uses an in-memory H2 database. You can access the H2 console at `http://localhost:8080/h2-console` with the following settings:
- JDBC URL: `jdbc:h2:mem:addressbook`
- Username: `sa`
- Password: (empty)

## Contact Fields

- First Name (required)
- Last Name (required)
- Email (required, must be valid email format)
- Phone Number (required, must be in E.164 format)
- Address (optional)
- Category (optional: Friend, Family, Colleague, Acquaintance)
