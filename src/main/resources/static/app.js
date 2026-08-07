const API_BASE = '/api/contacts';
const form = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let editingId = null;

document.addEventListener('DOMContentLoaded', () => fetchContacts());
searchBtn.addEventListener('click', handleSearch);

async function fetchContacts() {
    try {
        const res = await fetch(API_BASE);
        const contacts = await res.json();
        renderContacts(contacts);
    } catch (err) {
        console.error('Failed to load contacts:', err);
    }
}

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return fetchContacts();
    try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        renderContacts(await res.json());
    } catch (err) {
        console.error('Search failed:', err);
    }
}

function renderContacts(contacts) {
    contactList.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.address}</td>
            <td>${c.category}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editContact(${c.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        contactList.appendChild(tr);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    // Client-side validation refinement
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) { alert('Invalid email format'); return; }

    try {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        resetForm();
        fetchContacts();
    } catch (err) {
        console.error('Save failed:', err);
    }
});

async function editContact(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        const c = await res.json();
        editingId = id;
        document.getElementById('contactId').value = c.id;
        document.getElementById('firstName').value = c.firstName;
        document.getElementById('lastName').value = c.lastName;
        document.getElementById('email').value = c.email;
        document.getElementById('phoneNumber').value = c.phoneNumber;
        document.getElementById('address').value = c.address;
        document.getElementById('category').value = c.category;
        document.getElementById('formTitle').textContent = 'Edit Contact';
        document.getElementById('submitBtn').textContent = 'Update';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    } catch (err) {
        console.error('Load edit failed:', err);
    }
}

document.getElementById('cancelBtn').addEventListener('click', resetForm);

function resetForm() {
    editingId = null;
    form.reset();
    document.getElementById('formTitle').textContent = 'Add Contact';
    document.getElementById('submitBtn').textContent = 'Save';
    document.getElementById('cancelBtn').style.display = 'none';
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        fetchContacts();
    } catch (err) {
        console.error('Delete failed:', err);
    }
}
