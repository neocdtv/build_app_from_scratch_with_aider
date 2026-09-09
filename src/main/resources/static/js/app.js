const API_BASE = '/api/contacts';
const MESSAGE_CONTAINER = document.getElementById('message');
const CONTACTS_CONTAINER = document.getElementById('contactsContainer');
const CONTACT_FORM = document.getElementById('contactForm');
const SUBMIT_BTN = document.getElementById('submitBtn');
const CANCEL_BTN = document.getElementById('cancelBtn');
const ID_INPUT = document.getElementById('contactId');
const FIRST_NAME_INPUT = document.getElementById('firstName');
const LAST_NAME_INPUT = document.getElementById('lastName');
const EMAIL_INPUT = document.getElementById('email');
const PHONE_INPUT = document.getElementById('phone');
const ADDRESS_INPUT = document.getElementById('address');
const CATEGORY_INPUT = document.getElementById('category');
const SEARCH_INPUT = document.getElementById('searchInput');

let allContacts = [];

// Show success message
function showMessage(message, type = 'success') {
    MESSAGE_CONTAINER.textContent = message;
    MESSAGE_CONTAINER.className = `message ${type}`;
    MESSAGE_CONTAINER.style.display = 'block';
    
    setTimeout(() => {
        MESSAGE_CONTAINER.style.display = 'none';
    }, 4000);
}

// Show error message
function showError(message) {
    MESSAGE_CONTAINER.textContent = message;
    MESSAGE_CONTAINER.className = 'message error';
    MESSAGE_CONTAINER.style.display = 'block';
    
    setTimeout(() => {
        MESSAGE_CONTAINER.style.display = 'none';
    }, 4000);
}

// Load all contacts on page load
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allContacts = await response.json();
        displayContacts(allContacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
        showError('Failed to load contacts');
        CONTACTS_CONTAINER.innerHTML = `<p class="loading">Error: ${error.message}</p>`;
    }
}

// Display contacts in grid
function displayContacts(contacts) {
    if (contacts.length === 0) {
        CONTACTS_CONTAINER.innerHTML = `<p class="loading">No contacts found</p>`;
        return;
    }
    
    CONTACTS_CONTAINER.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <h3>
                ${contact.firstName} ${contact.lastName}
                <span>(${contact.category})</span>
            </h3>
            <div class="contact-info">
                <label>Email:</label> ${contact.email}
            </div>
            <div class="contact-info">
                <label>Phone:</label> ${contact.phoneNumber}
            </div>
            <div class="contact-info">
                <label>Address:</label> ${contact.address}
            </div>
            <div class="contact-actions">
                <a href="#" onclick="editContact(${contact.id})">Edit</a>
                <a href="#" onclick="deleteContact(${contact.id})" class="delete-btn">Delete</a>
            </div>
        </div>
    `).join('');
}

// Search contacts
async function searchContacts() {
    const query = SEARCH_INPUT.value.trim();
    
    if (query === '') {
        displayContacts(allContacts);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        displayContacts(results);
    } catch (error) {
        console.error('Error searching contacts:', error);
        showError('Failed to search contacts');
    }
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const contactId = ID_INPUT.value;
    const contact = {
        firstName: FIRST_NAME_INPUT.value.trim(),
        lastName: LAST_NAME_INPUT.value.trim(),
        email: EMAIL_INPUT.value.trim(),
        phoneNumber: PHONE_INPUT.value.trim(),
        address: ADDRESS_INPUT.value.trim(),
        category: CATEGORY_INPUT.value.trim()
    };
    
    // Basic validation
    const requiredFields = Object.values(contact);
    if (requiredFields.some(field => !field || field === '')) {
        showError('All fields are required');
        return;
    }
    
    let response;
    if (contactId) {
        // Update existing contact
        response = await fetch(`${API_BASE}/${contactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact)
        });
    } else {
        // Create new contact
        response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact)
        });
    }
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showError(errorData.message || `Failed to ${contactId ? 'update' : 'create'} contact`);
        return;
    }
    
    // Success
    showMessage(contactId ? 'Contact updated successfully' : 'Contact created successfully');
    CONTACT_FORM.reset();
    ID_INPUT.value = '';
    
    if (contactId) {
        // Re-render to show updated contact
        loadContacts();
    }
}

// Edit contact
async function editContact(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contact = await response.json();
        
        ID_INPUT.value = contact.id;
        FIRST_NAME_INPUT.value = contact.firstName;
        LAST_NAME_INPUT.value = contact.lastName;
        EMAIL_INPUT.value = contact.email;
        PHONE_INPUT.value = contact.phoneNumber;
        ADDRESS_INPUT.value = contact.address;
        CATEGORY_INPUT.value = contact.category;
        
        SUBMIT_BTN.textContent = 'Update Contact';
        SUBMIT_BTN.className = 'btn btn-primary';
        CANCEL_BTN.style.display = 'inline-block';
        
        CONTACT_FORM.reset();
        Object.values(contact).forEach((field, index) => {
            const inputId = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'category'][index];
            const input = document.getElementById(inputId);
            if (input) input.value = field;
        });
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error editing contact:', error);
        showError('Failed to load contact data');
    }
}

// Delete contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showMessage('Contact deleted successfully');
        loadContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
        showError('Failed to delete contact');
    }
}

// Cancel edit
function cancelEdit() {
    CONTACT_FORM.reset();
    ID_INPUT.value = '';
    SUBMIT_BTN.textContent = 'Add Contact';
    CANCEL_BTN.style.display = 'none';
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    CONTACT_FORM.addEventListener('submit', handleSubmit);
    CANCEL_BTN.addEventListener('click', cancelEdit);
    loadContacts();
});
