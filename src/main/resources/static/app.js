const API_URL = '/api/contacts';
const form = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');

document.addEventListener('DOMContentLoaded', fetchContacts);

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

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    resetForm();
    fetchContacts();
});

async function fetchContacts() {
    const res = await fetch(API_URL);
    const contacts = await res.json();
    renderContacts(contacts);
}

async function search() {
    const query = document.getElementById('searchInput').value;
    const res = await fetch(`${API_URL}/search?q=${query}`);
    const contacts = await res.json();
    renderContacts(contacts);
}

async function deleteContact(id) {
    if (confirm('Delete this contact?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
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
            <td>${c.category}</td>
            <td>
                <span class="btn-edit" onclick="editContact(${c.id})">Edit</span>
                <span class="btn-delete" onclick="deleteContact(${c.id})">Delete</span>
            </td>
        `;
        contactList.appendChild(tr);
    });
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
    
    document.getElementById('submitBtn').innerText = 'Update Contact';
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

function resetForm() {
    form.reset();
    document.getElementById('contactId').value = '';
    document.getElementById('submitBtn').innerText = 'Add Contact';
    document.getElementById('cancelBtn').style.display = 'none';
}
