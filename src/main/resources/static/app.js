const API_URL = '/api/contacts';

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

async function loadContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function renderContacts(contacts) {
    const tbody = document.getElementById('contacts-body');
    tbody.innerHTML = '';

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No contacts found</td></tr>';
        return;
    }

    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.address}</td>
            <td><span style="background:#e0e0e0; padding:2px 6px; border-radius:4px;">${contact.category}</span></td>
            <td>
                <button class="action-btn btn-edit" onclick="editContact(${JSON.stringify(contact).replace(/"/g, '&quot;')})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const contactId = document.getElementById('contact-id').value;
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
        if (contactId) {
            // Update existing contact
            response = await fetch(`${API_URL}/${contactId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            if (!response.ok) throw new Error('Failed to update');
        } else {
            // Create new contact
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            if (!response.ok) throw new Error('Failed to create');
        }
        
        resetForm();
        loadContacts();
    } catch (error) {
        alert(error.message || 'An error occurred saving the contact.');
    }
});

async function deleteContact(id) {
    if(confirm('Are you sure you want to delete this contact?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadContacts();
            } else {
                alert('Failed to delete contact.');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    }
}

function editContact(contact) {
    document.getElementById('contact-id').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;

    document.getElementById('form-title').textContent = 'Edit Contact';
    document.getElementById('save-btn').textContent = 'Update Contact';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
}

function resetForm() {
    contactForm.reset();
    document.getElementById('contact-id').value = '';
    document.getElementById('form-title').textContent = 'Add New Contact';
    document.getElementById('save-btn').textContent = 'Add Contact';
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

async function searchContacts() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        loadContacts();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Search failed:', error);
    }
}
