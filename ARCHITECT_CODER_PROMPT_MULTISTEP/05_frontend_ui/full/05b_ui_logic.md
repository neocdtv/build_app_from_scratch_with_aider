> STAGE 5B OF 5: EXECUTION ONLY
> DO NOT modify index.html or CSS files.
> Output the required diffs immediately.

**Goal:** Implement the client-side REST API integration.

**Tasks:**
1. Create `src/main/resources/static/js/app.js`.
2. Bind to the IDs defined in `index.html` (`#contact-form`, `#search-input`, `#contacts-table`).
3. Use `fetch('/api/contacts')` to:
   - Load and render contacts on page load.
   - Handle form POST/PUT submissions.
   - Handle DELETE button clicks.
   - Handle live search input events.
