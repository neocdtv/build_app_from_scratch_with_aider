const API_URL = '/api/contacts';
let contacts = [];

document.addEventListener('DOMContentLoaded', fetchContacts);
document.getElementById('contactForm').addEventListener('submit', saveContact);

async function fetchContacts() {
    const response = await fetch(API_URL);
    contacts = await response.json();
    renderTable(contacts);
}

async function searchContacts() {
    const query = document.getElementById('searchInput').value;
    const response = await fetch(`${API_URL}/search?q=${query}`);
    contacts = await response.json();
    renderTable(contacts);
}

function renderTable(data) {
    const tbody = document.getElementById('contactTableBody');
    tbody.innerHTML = '';
    data.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.firstName} ${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.category}</td>
                <td>
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>`;
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

async function editContact(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const c = await response.json();
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    document.getElementById('formTitle').innerText = 'Edit Contact';
}

async function deleteContact(id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
    }
}

function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('formTitle').innerText = 'Add Contact';
}
