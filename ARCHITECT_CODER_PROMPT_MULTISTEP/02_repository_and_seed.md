> STAGE 2 OF 5: EXECUTION ONLY
> DO NOT output a plan for future steps.
> DO NOT explain why you are writing this code.
> DO NOT write controllers or frontend code.
> Output the required diffs immediately.

**Goal:** Create the database repository and pre-populate sample data.

**Architecture Slice:**
* Directory: `src/main/java/com/addressbook/repository/ContactRepository.java`
* Directory: `src/main/java/com/addressbook/config/DatabaseInitializer.java` or `src/main/resources/data.sql`
* Requirement: 5 sample contacts must be pre-populated on startup.

**Tasks:**
1. Create `ContactRepository.java` extending `JpaRepository<Contact, Long>`.
2. Add a custom query method in the repository to search by name or category (e.g., `findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase`).
3. Create the mechanism (`DatabaseInitializer.java` or `data.sql`) to insert 5 diverse sample contacts into the H2 database on application startup.
4. Create the main application class `src/main/java/com/addressbook/AddressBookApplication.java` with `@SpringBootApplication` if it does not exist yet.