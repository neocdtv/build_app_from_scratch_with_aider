const API_BASE = '/api/contacts';
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const tbody = document.querySelector('#contactsTable tbody');

document.addEventListener('DOMContentLoaded', () => loadContacts());

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => renderTable(data))
            .catch(err => console.error('Search failed', err));
    } else {
        loadContacts();
    }
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    loadContacts();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        const url = id ? `${API_BASE}/${id}` : API_BASE;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
        if (res.ok) {
            resetForm();
            loadContacts(searchInput.value.trim() ? searchInput.value.trim() : null);
        } else {
            alert('Failed to save contact');
        }
    } catch (err) {
        console.error(err);
        alert('Error saving contact');
    }
});

cancelBtn.addEventListener('click', resetForm);

async function loadContacts(searchQuery = null) {
    const url = searchQuery ? `${API_BASE}/search?q=${encodeURIComponent(searchQuery)}` : API_BASE;
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderTable(data);
    } catch (err) {
        console.error('Failed to load contacts', err);
    }
}

function renderTable(data) {
    tbody.innerHTML = '';
    data.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(contact.firstName)}</td>
            <td>${escapeHtml(contact.lastName)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phoneNumber)}</td>
            <td>${escapeHtml(contact.category)}</td>
            <td class="actions">
                <button class="edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

window.editContact = async (id) => {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        const contact = await res.json();
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        submitBtn.textContent = 'Update Contact';
        cancelBtn.style.display = 'inline-block';
        form.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        console.error('Failed to fetch contact', err);
    }
};

window.deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (res.ok) loadContacts(searchInput.value.trim() || null);
    } catch (err) {
        console.error('Failed to delete contact', err);
    }
};

function resetForm() {
    form.reset();
    document.getElementById('contactId').value = '';
    submitBtn.textContent = 'Add Contact';
    cancelBtn.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
