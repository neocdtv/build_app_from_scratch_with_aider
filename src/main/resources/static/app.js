const API_URL = '/api/contacts';
const form = document.getElementById('contactForm');
const searchInput = document.getElementById('searchInput');
const tableBody = document.querySelector('#contactsTable tbody');
let isEditing = false;

async function fetchContacts(query = '') {
    const url = query ? `${API_URL}/search?q=${encodeURIComponent(query)}` : API_URL;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        return await res.json();
    } catch (err) { console.error(err); return []; }
}

function renderContacts(contacts) {
    tableBody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td><td>${c.email}</td><td>${c.phoneNumber}</td><td>${c.category}</td>
            <td class="actions">
                <button onclick="editContact(${c.id})">Edit</button>
                <button class="delete" onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        tableBody.appendChild(tr);
    });
}

async function loadAll() { renderContacts(await fetchContacts()); }

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        id: document.getElementById('contactId').value || undefined,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        category: document.getElementById('category').value.trim()
    };

    try {
        const url = data.id ? `${API_URL}/${data.id}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Server error');
        loadAll();
        resetForm();
    } catch (err) { alert(err.message || 'Save failed'); }
});

searchInput.addEventListener('input', (e) => fetchContacts(e.target.value).then(renderContacts));
document.getElementById('refreshBtn').addEventListener('click', loadAll);

window.editContact = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Load failed');
        const c = await res.json();
        document.getElementById('contactId').value = c.id;
        document.getElementById('firstName').value = c.firstName;
        document.getElementById('lastName').value = c.lastName;
        document.getElementById('email').value = c.email;
        document.getElementById('phoneNumber').value = c.phoneNumber;
        document.getElementById('address').value = c.address;
        document.getElementById('category').value = c.category;
        isEditing = true;
    } catch (err) { alert(err.message); }
};

window.deleteContact = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error('Delete failed');
        loadAll();
    } catch (err) { alert(err.message); }
};

function resetForm() {
    form.reset();
    document.getElementById('contactId').value = '';
    isEditing = false;
}
loadAll();
