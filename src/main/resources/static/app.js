const API_URL = '/api/contacts';

// DOM Elements
const contactForm = document.getElementById('contactForm');
const contactTableBody = document.getElementById('contactTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');

// State
let isEditing = false;

document.addEventListener('DOMContentLoaded', fetchContacts);

// Fetch and Display Contacts
async function fetchContacts(query = '') {
    const url = query ? `${API_URL}/search?q=${encodeURIComponent(query)}` : API_URL;
    try {
        const response = await fetch(url);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

function displayContacts(contacts) {
    contactTableBody.innerHTML = '';
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.category}</td>
            <td>
                <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        contactTableBody.appendChild(row);
    });
}

// Handle Form Submission (Create/Update)
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    const id = document.getElementById('contactId').value;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            resetForm();
            fetchContacts();
        } else {
            alert('Failed to save contact. Please check the data.');
        }
    } catch (error) {
        console.error('Error saving contact:', error);
    }
});

// Delete Contact
async function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    }
}

// Edit Contact (Populate Form)
async function editContact(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const contact = await response.json();

        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;

        isEditing = true;
        formTitle.innerText = 'Edit Contact';
        cancelBtn.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching contact for editing:', error);
    }
}

// Search logic
searchBtn.addEventListener('click', () => fetchContacts(searchInput.value));
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    fetchContacts();
});

// Reset Form
function resetForm() {
    contactForm.reset();
    document.getElementById('contactId').value = '';
    isEditing = false;
    formTitle.innerText = 'Add New Contact';
    cancelBtn.classList.add('hidden');
}

cancelBtn.addEventListener('click', resetForm);
