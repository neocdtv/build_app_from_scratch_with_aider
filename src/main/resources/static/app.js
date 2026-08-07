document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const searchInput = document.getElementById('search-input');
    const contactsList = document.getElementById('contacts-list');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const contactIdField = document.getElementById('contact-id');

    let isEditing = false;

    async function fetchContacts(filterQuery = '') {
        try {
            const url = filterQuery ? `/api/contacts/search?q=${encodeURIComponent(filterQuery)}` : '/api/contacts';
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch contacts');
            renderContacts(await res.json());
        } catch (err) { console.error(err); alert('Error loading contacts.'); }
    }

    function renderContacts(contacts) {
        contactsList.innerHTML = '';
        if (!contacts.length) { contactsList.innerHTML = '<tr><td colspan="5">No contacts found.</td></tr>'; return; }
        contacts.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</td>
                <td>${escapeHtml(c.email)}</td>
                <td>${escapeHtml(c.phoneNumber)}</td>
                <td>${escapeHtml(c.category)}</td>
                <td>
                    <button class="edit-btn" onclick="loadContactForEdit(${c.id},'${escapeHtml(c.firstName)}','${escapeHtml(c.lastName)}','${escapeHtml(c.email)}','${escapeHtml(c.phoneNumber)}','${escapeHtml(c.address)}','${escapeHtml(c.category)}')">Edit</button>
                    <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
                </td>`;
            contactsList.appendChild(row);
        });
    }

    function escapeHtml(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = { firstName: document.getElementById('firstName').value, lastName: document.getElementById('lastName').value, email: document.getElementById('email').value, phoneNumber: document.getElementById('phoneNumber').value, address: document.getElementById('address').value, category: document.getElementById('category').value };
        try {
            const res = await fetch(isEditing ? `/api/contacts/${contactIdField.value}` : '/api/contacts', { method: isEditing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (!res.ok) throw new Error('Validation failed');
            form.reset(); contactIdField.value = ''; isEditing = false; formTitle.textContent = 'Add Contact'; submitBtn.textContent = 'Add Contact'; cancelBtn.style.display = 'none'; fetchContacts(searchInput.value);
        } catch { alert('Invalid data. Please check fields and try again.'); }
    });

    window.loadContactForEdit = (id, fn, ln, email, phone, addr, cat) => {
        contactIdField.value = id; document.getElementById('firstName').value = fn; document.getElementById('lastName').value = ln; document.getElementById('email').value = email; document.getElementById('phoneNumber').value = phone; document.getElementById('address').value = addr; document.getElementById('category').value = cat; formTitle.textContent = 'Edit Contact'; submitBtn.textContent = 'Update Contact'; cancelBtn.style.display = 'inline-block'; isEditing = true;
    };

    window.deleteContact = async (id) => { if (!confirm('Delete this contact?')) return; try { await fetch(`/api/contacts/${id}`, { method: 'DELETE' }); fetchContacts(searchInput.value); } catch { alert('Delete failed.'); } };

    cancelBtn.addEventListener('click', () => { form.reset(); contactIdField.value = ''; isEditing = false; formTitle.textContent = 'Add Contact'; submitBtn.textContent = 'Add Contact'; cancelBtn.style.display = 'none'; });
    document.getElementById('search-btn').addEventListener('click', () => fetchContacts(searchInput.value.trim()));
    fetchContacts();
});
