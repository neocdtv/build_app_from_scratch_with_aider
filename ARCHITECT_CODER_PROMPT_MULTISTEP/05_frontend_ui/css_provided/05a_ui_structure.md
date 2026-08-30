> STAGE 5A OF 5: EXECUTION ONLY
> DO NOT write JavaScript code or backend code.
> DO NOT write a custom styles.css file.
> Output the required diffs immediately.

**Goal:** Create the HTML markup for the Address Book UI using a zero-config CSS framework.

**Architecture Slice:**
* Directory: `src/main/resources/static/`
* Styling: Pico.css via CDN.

**Tasks:**
1. Create `src/main/resources/static/index.html`.
2. Include the Pico.css CDN in the `<head>`: 
   `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">`
3. Wrap the body content in `<main class="container">`.
4. Build the UI layout with:
   - A form (`id="contact-form"`) with semantic inputs for firstName, lastName, email, phoneNumber, address, and category.
   - A search input (`id="search-input"`).
   - A table or grid container (`id="contacts-table"`) to display the address book entries.
