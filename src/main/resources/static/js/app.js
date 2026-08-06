const API_URL = '/api/contacts';
const form = document.getElementById('contact-form');
const searchInput = document.getElementById('search-input');
const tbody = document.querySelector('#contacts-table tbody');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const idInput = document.getElementById('id');

let editingId = null;

function renderContacts(contacts) {
    tbody.innerHTML = '';
    contacts.forEach(contact => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phoneNumber)}</td>
            <td>${escapeHtml(contact.address)}</td>
            <td>${escapeHtml(contact.category)}</td>
            <td class="actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

async function fetchContacts(query = '') {
    try {
        const res = query ? await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`) : await fetch(API_URL);
        if (!res.ok) throw new Error('Network response was not ok');
        return await res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        return [];
    }
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

    try {
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to save contact');
        resetForm();
        loadContacts();
    } catch (err) {
        alert('Error saving contact: ' + err.message);
    }
});

searchInput.addEventListener('input', (e) => {
    loadContacts(e.target.value);
});

window.editContact = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch contact');
        const contact = await res.json();
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        idInput.value = contact.id;
        editingId = contact.id;
        submitBtn.textContent = 'Update Contact';
        cancelBtn.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        alert('Error loading contact: ' + err.message);
    }
};

window.deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete contact');
        loadContacts(searchInput.value);
    } catch (err) {
        alert('Error deleting contact: ' + err.message);
    }
};

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    idInput.value = '';
    editingId = null;
    submitBtn.textContent = 'Add Contact';
    cancelBtn.classList.add('hidden');
}

async function loadContacts(query = '') {
    const contacts = await fetchContacts(query);
    renderContacts(contacts);
}

loadContacts();
