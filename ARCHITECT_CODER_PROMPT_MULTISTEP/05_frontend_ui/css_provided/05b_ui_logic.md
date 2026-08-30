> STAGE 5B OF 5: EXECUTION ONLY
> DO NOT modify index.html or backend code.
> DO NOT write CSS.
> Output the required diffs immediately.

**Goal:** Implement the client-side REST API integration.

**Architecture Slice:**
* Directory: `src/main/resources/static/`
* API Base Path to consume: `/api/contacts`

**Tasks:**
1. Create `src/main/resources/static/js/app.js`.
2. Ensure it is linked properly at the bottom of `index.html` if it wasn't added in the previous step.
3. Bind to the DOM elements: `#contact-form`, `#search-input`, `#contacts-table`.
4. Use standard `fetch()` API to implement:
   - Load and render all contacts on page load (GET `/api/contacts`).
   - Handle form submissions to create (POST) or update (PUT) contacts.
   - Handle DELETE requests when a delete button on a contact is clicked.
   - Handle live searching (GET `/api/contacts/search?q=`).
