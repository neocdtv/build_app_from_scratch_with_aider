> STAGE 4 OF 5: EXECUTION ONLY
> DO NOT output a plan for future steps.
> DO NOT explain why you are writing this code.
> DO NOT write the frontend code yet.
> Output the required diffs immediately.

**Goal:** Expose the REST API endpoints.

**Architecture Slice:**
* Directory: `src/main/java/com/addressbook/controller/ContactController.java`
* Base Path: `/api/contacts`
* Validation: Server-side validation using Spring `@Valid` annotations on request bodies.

**REST API Specification:**
| HTTP Method | Endpoint | Request Body | Response Body |
|-------------|----------|--------------|---------------|
| `GET` | `/api/contacts` | None | `[Contact]` (array) |
| `GET` | `/api/contacts/{id}` | None | `Contact` object |
| `POST` | `/api/contacts` | `Contact` JSON | `Contact` object (201 status) |
| `PUT` | `/api/contacts/{id}` | `Contact` JSON | `Contact` object |
| `DELETE` | `/api/contacts/{id}` | None | `204 No Content` |
| `GET` | `/api/contacts/search?q={query}` | None | `[Contact]` (array) |

**Tasks:**
1. Create `ContactController.java` annotated with `@RestController` and `@RequestMapping("/api/contacts")`.
2. Inject the `ContactService`.
3. Implement all endpoints matching the specification above. Ensure `@Valid` is used on POST and PUT.