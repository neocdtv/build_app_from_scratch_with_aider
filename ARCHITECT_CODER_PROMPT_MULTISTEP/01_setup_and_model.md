> STAGE 1 OF 5: EXECUTION ONLY
> DO NOT output a plan for future steps.
> DO NOT explain why you are writing this code.
> DO NOT write repositories, controllers, or frontend code yet.
> Output the required diffs immediately.

**Goal:** Initialize the Maven project, configure the H2 database, and create the Contact entity.

**Architecture Slice:**
* Tech Stack: Spring Boot with Java 17+, JPA, H2 database, Jakarta Validation.
* Directory for Contact.java: `src/main/java/com/addressbook/model/`

**Entity Mapping Specification:**
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Long | `@Id`, `@GeneratedValue`, non-null | Primary key, auto-increment |
| `firstName` | String | `@NotBlank`, max 50 chars | Contact first name |
| `lastName` | String | `@NotBlank`, max 50 chars | Contact last name |
| `email` | String | `@NotBlank`, `@Email`, max 100 chars | Contact email address |
| `phoneNumber` | String | `@NotBlank`, max 20 chars | Contact phone number |
| `address` | String | `@NotBlank`, max 255 chars | Physical address |
| `category` | String | `@NotBlank`, max 50 chars | Tag/Category (e.g., Family, Work) |

**Tasks:**
1. Create `pom.xml` with dependencies: Spring Boot Starter Web, Data JPA, Validation, and H2.
2. Create `src/main/resources/application.properties` configured for an H2 in-memory DB with the H2 console enabled.
3. Create the `Contact.java` entity with the specified fields, JPA annotations, and Jakarta validation.
