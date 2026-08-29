// DOM Elements
const contactForm = document.getElementById('contactForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const contactsTableBody = document.getElementById('contactsTableBody');
const contactsTable = document.getElementById('contactsTable');
const contactsContainer = document.getElementById('contactsContainer');
const loading = document.getElementById('loading');
const noContacts = document.getElementById('noContacts');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const contactIdInput = document.getElementById('contactId');

// State
let contacts = [];
let isEditing = false;

// API Base URL
const API_BASE = '/api/contacts';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    contactForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    cancelBtn.addEventListener('click', handleCancelEdit);
}

// Load all contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/`);
        if (response.ok) {
            const data = await response.json();
            contacts = data;
            renderContacts();
        } else {
            console.error('Failed to load contacts:', response.status);
            showError('Failed to load contacts');
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
        showError('An error occurred while loading contacts');
    }
}

// Handle search
function handleSearch(e) {
    if (e) {
        e.preventDefault();
    }
    const query = searchInput.value.trim();
    if (query) {
        loadContactsFromSearch(query);
    } else {
        renderContacts();
    }
}

// Search contacts
async function loadContactsFromSearch(query) {
    try {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const data = await response.json();
            contacts = data;
            renderContacts();
        } else {
            console.error('Failed to search contacts:', response.status);
            showError('Failed to search contacts');
        }
    } catch (error) {
        console.error('Error searching contacts:', error);
        showError('An error occurred while searching');
    }
}

// Render contacts to table
function renderContacts() {
    contactsTableBody.innerHTML = '';
    
    if (contacts.length === 0) {
        noContacts.style.display = 'block';
        contactsTable.style.display = 'none';
        return;
    }
    
    noContacts.style.display = 'none';
    contactsTable.style.display = 'table';
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.address}</td>
            <td>${contact.category}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </td>
        `;
        contactsTableBody.appendChild(row);
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        address: formData.get('address'),
        category: formData.get('category')
    };
    
    try {
        const id = contactIdInput.value;
        const url = id ? `${API_BASE}/${id}` : API_BASE;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            if (id) {
                isEditing = false;
                submitBtn.textContent = 'Add Contact';
                contactForm.reset();
                contactIdInput.value = '';
                cancelBtn.style.display = 'none';
            } else {
                loadContacts();
            }
            showSuccess(id ? 'Contact updated successfully!' : 'Contact added successfully!');
        } else {
            const errorText = await response.text();
            showError(`Failed to ${id ? 'update' : 'add'} contact: ${errorText}`);
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        showError('An error occurred while saving the contact');
    }
}

// Edit contact
function editContact(id) {
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return;
    
    const contact = contacts[index];
    
    document.getElementById('contactId').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;
    
    isEditing = true;
    submitBtn.textContent = 'Update Contact';
    cancelBtn.style.display = 'inline-block';
    contactForm.reset();
    contactForm.reset();
    contactForm.reset();
    contactForm.reset();
}

// Handle cancel edit
function handleCancelEdit() {
    contactForm.reset();
    contactIdInput.value = '';
    isEditing = false;
    submitBtn.textContent = 'Add Contact';
    cancelBtn.style.display = 'none';
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
        
        if (response.ok) {
            loadContacts();
            showSuccess('Contact deleted successfully!');
        } else {
            const errorText = await response.text();
            showError(`Failed to delete contact: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        showError('An error occurred while deleting the contact');
    }
}

// Show success message
function showSuccess(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message success';
    messageDiv.textContent = message;
    contactsContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Show error message
function showError(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error';
    messageDiv.textContent = message;
    contactsContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
