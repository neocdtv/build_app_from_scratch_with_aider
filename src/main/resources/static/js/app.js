const API_BASE = "/api/contacts";

const form = document.getElementById("contact-form");
const cancelButton = document.getElementById("cancel-button");
const saveButton = document.getElementById("save-button");
const searchInput = document.getElementById("search-input");

const fields = ["id", "firstName", "lastName", "email", "phoneNumber", "address", "category"];

let editingId = null;

async function fetchContacts() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error("Failed to load contacts");
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
}

async function renderList(query) {
    const rows = query && query.trim().length > 0 ? await search(query) : await fetchContacts();
    const tbody = document.getElementById("contacts-body");
    tbody.innerHTML = "";

    if (!rows || rows.length === 0) {
        tbody.insertAdjacentHTML(
            "beforeend",
            '<tr class="empty-row"><td colspan="6">No contacts found.</td></tr>'
        );
        return;
    }

    for (const contact of rows) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phoneNumber)}</td>
            <td>${escapeHtml(contact.address)}</td>
            <td>${escapeHtml(contact.category)}</td>
            <td class="actions-col">
                <button class="btn-edit" data-id="${contact.id}">Edit</button>
                <button class="btn-delete" data-id="${contact.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

    tbody.querySelectorAll(".btn-edit").forEach((button) => {
        button.addEventListener("click", () => startEdit(Number(button.dataset.id)));
    });
    tbody.querySelectorAll(".btn-delete").forEach((button) => {
        button.addEventListener("click", () => removeContact(Number(button.dataset.id)));
    });
}

async function search(query) {
    try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Search failed");
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

function clearForm() {
    fields.forEach((name) => (document.getElementById(name).value = ""));
    editingId = null;
    saveButton.textContent = "Add Contact";
    saveButton.classList.add("primary");
    cancelButton.classList.add("hidden");
}

async function startEdit(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) throw new Error("Contact not found");
        const contact = await response.json();

        fields.forEach((name) => (document.getElementById(name).value = contact[name] ?? ""));
        editingId = id;
        saveButton.textContent = "Update Contact";
        saveButton.classList.remove("primary");
        cancelButton.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        alert(error.message);
    }
}

function cancelEdit() {
    clearForm();
}

async function persist(event) {
    event.preventDefault();

    const payload = {};
    fields.forEach((name) => {
        value = document.getElementById(name).value.trim();
        if (["id"].includes(name)) return;
        payload[name] = value;
    });

    try {
        let response;
        if (editingId != null) {
            response = await fetch(`${API_BASE}/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            response = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }

        if (!response.ok) throw new Error("Operation failed");

        clearForm();
        renderList(searchInput.value);
    } catch (error) {
        alert(error.message);
    }
}

async function removeContact(id) {
    if (!confirm(`Delete this contact? This cannot be undone.`)) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (response.status !== 204 && !response.ok) throw new Error("Deletion failed");
        renderList(searchInput.value);
    } catch (error) {
        alert(error.message);
    }
}

form.addEventListener("submit", persist);
cancelButton.addEventListener("click", cancelEdit);
searchInput.addEventListener("input", () => renderList(searchInput.value));

renderList("");
