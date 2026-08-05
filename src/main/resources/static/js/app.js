const API_URL = '/api/contacts';
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');

document.addEventListener('DOMContentLoaded', fetchContacts);

contactForm.addEventListener('submit', handleFormSubmit);

async function fetchContacts() {
    const search = document.getElementById('searchInput').value;
    const response = await fetch(`${API_URL}${search ? `?search=${search}` : ''}`);
    const contacts = await response.json();
    renderContacts(contacts);
}

function renderContacts(contacts) {
    contactList.innerHTML = '';
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.category || ''}</td>
            <td>
                <span class="btn-edit" onclick="editContact(${contact.id})">Edit</span>
                <span class="btn-delete" onclick="deleteContact(${contact.id})">Delete</span>
            </td>
        `;
        contactList.appendChild(row);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });

    if (response.ok) {
        closeModal();
        fetchContacts();
    } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to save contact'));
    }
}

async function editContact(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const contact = await response.json();

    document.getElementById('contactId').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;

    document.getElementById('modalTitle').innerText = 'Edit Contact';
    showModal();
}

async function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchContacts();
        } else {
            alert('Failed to delete contact');
        }
    }
}

function searchContacts() {
    fetchContacts();
}

function showModal() {
    contactForm.reset();
    document.getElementById('contactId').value = '';
    document.getElementById('modalTitle').innerText = 'Add Contact';
    contactModal.style.display = 'block';
}

function closeModal() {
    contactModal.style.display = 'none';
}
