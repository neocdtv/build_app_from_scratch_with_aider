> STAGE 5 OF 5: EXECUTION ONLY
> DO NOT output a plan for future steps.
> DO NOT explain why you are writing this code.
> DO NOT modify the Java backend code.
> Output the required diffs immediately.

**Goal:** Create the frontend UI to interact with the REST API.

**Architecture Slice:**
* Tech Stack: Vanilla HTML, CSS, JavaScript (no frameworks).
* Directory: `src/main/resources/static/`
* API Base Path to consume: `/api/contacts`

**Tasks:**
1. Create `index.html` with a clean layout containing:
   - A search bar.
   - A form to add/edit contacts.
   - A table or grid list to display contacts.
2. Create `css/styles.css` to style the UI cleanly and responsively.
3. Create `js/app.js` using the standard `fetch()` API to:
   - Load and display all contacts on page load.
   - Handle form submissions to POST (create) or PUT (update) contacts. Include client-side validation before the API call.
   - Handle DELETE requests when a delete button is clicked.
   - Handle live searching using the `/search?q=` endpoint.