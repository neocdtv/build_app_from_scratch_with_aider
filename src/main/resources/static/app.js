const API_BASE_URL = '/api/contacts';

let contacts = [];
let editingContactId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

// Load all contacts
async function loadContacts() {
    try {
        const response = await fetch(API_BASE_URL);
        contacts = await response.json();
        renderContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Render contacts list
function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<div class="empty-message">No contacts found</div>';
        return;
    }

    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-card" data-id="${contact.id}">
            <h3>${contact.firstName} ${contact.lastName}</h3>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phoneNumber}</p>
            <p><strong>Address:</strong> ${contact.address}</p>
            <p><strong>Category:</strong> ${contact.category}</p>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Search contacts
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(results => {
                contacts = results;
                renderContacts();
            })
            .catch(error => console.error('Error searching contacts:', error));
    }
});

// Save contact (create or update)
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        let response;
        if (editingContactId) {
            response = await fetch(`${API_BASE_URL}/${editingContactId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
        } else {
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
        }

        if (response.ok) {
            await loadContacts();
            resetForm();
        } else {
            alert('Error saving contact');
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        alert('Error saving contact');
    }
});

// Edit contact
function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editingContactId = id;
        document.getElementById('contactId').value = id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        document.getElementById('saveButton').textContent = 'Update Contact';
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadContacts();
        } else {
            alert('Error deleting contact');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact');
    }
}

// Cancel editing
document.getElementById('cancelButton').addEventListener('click', () => {
    resetForm();
});

// Reset form
function resetForm() {
    editingContactId = null;
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('saveButton').textContent = 'Save Contact';
}

// Allow Enter key to search
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});
