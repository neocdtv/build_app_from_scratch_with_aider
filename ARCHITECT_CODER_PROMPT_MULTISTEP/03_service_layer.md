> STAGE 3 OF 5: EXECUTION ONLY
> DO NOT output a plan for future steps.
> DO NOT explain why you are writing this code.
> DO NOT write the REST controller or frontend code yet.
> Output the required diffs immediately.

**Goal:** Implement the business logic service layer.

**Architecture Slice:**
* Directory: `src/main/java/com/addressbook/service/ContactService.java`
* The service acts as the transaction boundary between the Controller and the Repository.

**Tasks:**
1. Create `ContactService.java` annotated with `@Service`.
2. Inject `ContactRepository`.
3. Implement methods for the following operations:
   - Get all contacts
   - Get single contact by ID (throw an exception if not found)
   - Create new contact
   - Update existing contact
   - Delete contact by ID
   - Search contacts by query string (name or category)