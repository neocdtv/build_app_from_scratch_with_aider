// Address Book - Frontend JavaScript
// Handles client-side REST API integration

const API_BASE_URL = '/api/contacts';

// DOM Elements
const contactForm = document.getElementById('contact-form');
const searchInput = document.getElementById('search-input');
const contactsTable = document.getElementById('contacts-table');
const tbody = contactsTable.querySelector('tbody');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phoneNumber');
const addressInput = document.getElementById('address');
const categoryInput = document.getElementById('category');
const idInput = document.getElementById('contact-id');

// State
let contacts = [];

// Load contacts on page load
async function loadContacts() {
    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        contacts = data;
        renderContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
        showNotification('Error loading contacts', 'error');
    }
}

// Render contacts to the table
function renderContacts() {
    tbody.innerHTML = '';
    
    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No contacts found</td></tr>';
        return;
    }
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.address}</td>
            <td>${contact.category}</td>
            <td>
                <button class="button button-secondary" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(contactForm);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        address: formData.get('address'),
        category: formData.get('category')
    };
    
    // Check if this is an update operation (form contains id field)
    const isUpdate = contactForm.querySelector('[name="id"]') || contactForm.querySelector('[name="contact-id"]');
    
    if (isUpdate) {
        // Update existing contact - send ID in the body
        const id = contactData.id || contactForm.get('id') || contactForm.get('contact-id');
        if (id) {
            contactData.id = id;
            updateContact(id, contactData);
        }
    } else {
        // Create new contact
        createContact(contactData);
    }
    
    contactForm.reset();
    loadContacts();
}

// Create a new contact
async function createContact(contactData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create contact');
        }
        
        showNotification('Contact added successfully', 'success');
    } catch (error) {
        console.error('Error creating contact:', error);
        showNotification('Error creating contact', 'error');
    }
}

// Update an existing contact
async function updateContact(id, contactData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
        
        showNotification('Contact updated successfully', 'success');
    } catch (error) {
        console.error('Error updating contact:', error);
        showNotification('Error updating contact', 'error');
    }
}

// Delete a contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
        
        showNotification('Contact deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting contact:', error);
        showNotification('Error deleting contact', 'error');
    }
}

// Handle search
async function performSearch() {
    const query = searchInput.value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        contacts = data;
        renderContacts();
    } catch (error) {
        console.error('Error searching contacts:', error);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Simple notification using console for now
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Event Listeners
contactForm.addEventListener('submit', handleSubmit);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});
