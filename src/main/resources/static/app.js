const API_URL = '/api/contacts';

document.addEventListener('DOMContentLoaded', loadContacts);

async function loadContacts() {
    const res = await fetch(API_URL);
    const contacts = await res.json();
    renderTable(contacts);
}

async function searchContacts() {
    const query = document.getElementById('searchInput').value;
    if (!query.trim()) return loadContacts();
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    const contacts = await res.json();
    renderTable(contacts);
}

function renderTable(contacts) {
    const tbody = document.querySelector('#contactsTable tbody');
    tbody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.address}</td>
            <td>${c.category}</td>
            <td>
                <button onclick='editContact(${JSON.stringify(c)})'>Edit</button>
                <button onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function openModal() { document.getElementById('modal').style.display = 'block'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

function editContact(contact) {
    document.getElementById('contactId').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;
    document.getElementById('modalTitle').textContent = 'Edit Contact';
    openModal();
}

async function deleteContact(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadContacts();
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
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

    // Client-side validation reinforcement
    if (!Object.values(contact).every(v => v.trim() !== '')) {
        alert('All fields are required.'); return;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact)
    });
    closeModal();
    loadContacts();
});
