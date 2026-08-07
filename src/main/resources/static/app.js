const API_URL = '/api/contacts';

document.getElementById('contactForm').addEventListener('submit', saveContact);

async function fetchContacts() {
    const res = await fetch(API_URL);
    const contacts = await res.json();
    renderTable(contacts);
}

async function search() {
    const q = document.getElementById('searchInput').value;
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`);
    const contacts = await res.json();
    renderTable(contacts);
}

function renderTable(contacts) {
    const tbody = document.getElementById('contactTableBody');
    tbody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.category}</td>
            <td>
                <button onclick="editContact(${c.id})">Edit</button>
                <button onclick="deleteContact(${c.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveContact(e) {
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
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    resetForm();
    fetchContacts();
}

async function deleteContact(id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
    }
}

async function editContact(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const c = await res.json();
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
}

function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
}

fetchContacts();
