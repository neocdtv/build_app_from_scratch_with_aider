let contacts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
});

async function fetchContacts() {
    const res = await fetch('/api/contacts');
    contacts = await res.json();
    renderTable(contacts);
}

async function handleSearch(e) {
    const query = e.target.value;
    if (!query) {
        fetchContacts();
        return;
    }
    const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`);
    const filtered = await res.json();
    renderTable(filtered);
}

function renderTable(data) {
    const tbody = document.querySelector('#contactTable tbody');
    tbody.innerHTML = '';
    data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.category}</td>
            <td>
                <button class="edit-btn" onclick="showEditModal(${c.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showAddModal() {
    document.getElementById('modalTitle').innerText = 'Add Contact';
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('contactModal').style.display = 'block';
}

async function showEditModal(id) {
    const res = await fetch(`/api/contacts/${id}`);
    const c = await res.json();
    document.getElementById('modalTitle').innerText = 'Edit Contact';
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
}

async function handleFormSubmit(e) {
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

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/contacts/${id}` : '/api/contacts';

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    if (res.ok) {
        closeModal();
        fetchContacts();
    } else {
        alert('Error saving contact. Check validation.');
    }
}

async function deleteContact(id) {
    if (confirm('Are you sure?')) {
        await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        fetchContacts();
    }
}
