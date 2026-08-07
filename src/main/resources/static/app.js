const API = '/api/contacts';
const form = document.getElementById('contactForm');
const tableBody = document.getElementById('contactTableBody');
const searchInput = document.getElementById('searchInput');

async function loadContacts(query = '') {
    const res = await fetch(`${API}${query ? `/search?q=${encodeURIComponent(query)}` : ''}`);
    const contacts = await res.json();
    tableBody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td><td>${c.email}</td><td>${c.phoneNumber}</td><td>${c.category}</td>
            <td>
                <button onclick="editContact(${c.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        tableBody.appendChild(tr);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const payload = Object.fromEntries(new FormData(form).entries());
    // Client-side email validation fallback
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) { alert('Invalid email'); return; }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API}/${id}` : API;
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Failed to save');
        form.reset(); document.getElementById('contactId').value = '';
        loadContacts(searchInput.value);
    } catch (err) { alert('Error saving contact'); }
});

async function editContact(id) {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) return;
    const c = await res.json();
    form.reset();
    document.getElementById('contactId').value = c.id;
    for (const key in c) { if (key !== 'id') document.getElementById(key).value = c[key]; }
}

async function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.ok) loadContacts(searchInput.value);
}

searchInput.addEventListener('input', (e) => loadContacts(e.target.value));
document.addEventListener('DOMContentLoaded', () => loadContacts());
