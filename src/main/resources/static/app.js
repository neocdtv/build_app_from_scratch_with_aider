const API_BASE = '/api/contacts';
let editMode = false;

// --- Utility functions ---
function clearForm() {
    document.getElementById('contact-id').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('address').value = '';
    document.getElementById('category').value = '';
    document.getElementById('form-title').textContent = 'Add Contact';
    document.getElementById('cancel-edit').style.display = 'none';
}

function renderTable(contacts) {
    const tbody = document.querySelector('#contacts-table tbody');
    tbody.innerHTML = '';
    contacts.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.firstName}</td>
            <td>${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.address}</td>
            <td>${c.category}</td>
            <td>
                <button onclick="editContact(${c.id})">Edit</button>
                <button onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        tbody.appendChild(row);
    });
}

// --- API calls ---
async function fetchAll() {
    const resp = await fetch(API_BASE);
    const data = await resp.json();
    renderTable(data);
}

async function createOrUpdate(c) {
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `${API_BASE}/${c.id}` : API_BASE;
    const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c)
    });
    if (resp.ok) {
        clearForm();
        editMode = false;
        fetchAll();
    } else {
        alert('Error saving contact');
    }
}

async function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    const resp = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (resp.ok) fetchAll();
    else alert('Error deleting');
}

function editContact(id) {
    fetch(`${API_BASE}/${id}`)
        .then(r => r.json())
        .then(c => {
            document.getElementById('contact-id').value = c.id;
            document.getElementById('firstName').value = c.firstName;
            document.getElementById('lastName').value = c.lastName;
            document.getElementById('email').value = c.email;
            document.getElementById('phoneNumber').value = c.phoneNumber;
            document.getElementById('address').value = c.address;
            document.getElementById('category').value = c.category;
            document.getElementById('form-title').textContent = 'Edit Contact';
            document.getElementById('cancel-edit').style.display = '';
            editMode = true;
        });
}

// --- Event listeners ---
document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const contact = {
        id: document.getElementById('contact-id').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };
    createOrUpdate(contact);
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    clearForm();
    editMode = false;
});

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (!query) { fetchAll(); return; }
    fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(renderTable);
});

fetchAll();
