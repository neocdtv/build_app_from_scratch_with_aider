// Address Book Application - Frontend JavaScript

let contacts = [];
let isEditing = false;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const addContactBtn = document.getElementById('addContactBtn');
const contactForm = document.getElementById('contactForm');
const contactsBody = document.getElementById('contactsBody');
const contactCount = document.getElementById('contactCount');
const messageArea = document.getElementById('messageArea');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');
const contactId = document.getElementById('contactId');
const submitBtn = document.getElementById('submitBtn');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    clearSearchBtn.addEventListener('click', handleClearSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    addContactBtn.addEventListener('click', openAddModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    contactForm.addEventListener('submit', handleFormSubmit);
}

// API Functions
async function loadContacts(searchQuery = null) {
    try {
        const url = searchQuery 
            ? `/api/contacts/search?q=${encodeURIComponent(searchQuery)}`
            : '/api/contacts';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load contacts');
        
        contacts = await response.json();
        renderContacts();
    } catch (error) {
        showMessage('Error loading contacts: ' + error.message, 'error');
    }
}

async function createContact(contactData) {
    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) throw new Error('Failed to create contact');
        
        showMessage('Contact created successfully!', 'success');
        return await response.json();
    } catch (error) {
        showMessage('Error creating contact: ' + error.message, 'error');
        throw error;
    }
}

async function updateContact(id, contactData) {
    try {
        const response = await fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) throw new Error('Failed to update contact');
        
        showMessage('Contact updated successfully!', 'success');
        return await response.json();
    } catch (error) {
        showMessage('Error updating contact: ' + error.message, 'error');
        throw error;
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return false;
    }
    
    try {
        const response = await fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete contact');
        
        showMessage('Contact deleted successfully!', 'success');
        return true;
    } catch (error) {
        showMessage('Error deleting contact: ' + error.message, 'error');
        throw error;
    }
}

// Render Functions
function renderContacts() {
    contactsBody.innerHTML = '';
    
    if (contacts.length === 0) {
        contactsBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #718096;">No contacts found. Add your first contact!</td></tr>';
        contactCount.textContent = '0 contacts';
        return;
    }
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        
        const categoryClass = `category-${contact.category.toLowerCase()}`;
        
        row.innerHTML = `
            <td>${escapeHtml(contact.firstName)}</td>
            <td>${escapeHtml(contact.lastName)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phoneNumber)}</td>
            <td>${escapeHtml(contact.address)}</td>
            <td><span class="category-badge ${categoryClass}">${escapeHtml(contact.category)}</span></td>
            <td class="actions">
                <button class="btn btn-edit" onclick="openEditModal(${contact.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteContactById(${contact.id})">Delete</button>
            </td>
        `;
        
        contactsBody.appendChild(row);
    });
    
    contactCount.textContent = `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`;
}

// Modal Functions
function openAddModal() {
    isEditing = false;
    modalTitle.textContent = 'Add Contact';
    submitBtn.textContent = 'Save Contact';
    contactId.value = '';
    
    // Clear form and errors
    contactForm.reset();
    clearErrors();
    
    contactModal.classList.add('show');
}

function openEditModal(contactId) {
    isEditing = true;
    modalTitle.textContent = 'Edit Contact';
    submitBtn.textContent = 'Update Contact';
    document.getElementById('contactId').value = contactId;
    
    // Find and populate form with contact data
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
    }
    
    clearErrors();
    contactModal.classList.add('show');
}

function closeModal() {
    contactModal.classList.remove('show');
    contactForm.reset();
    clearErrors();
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    const contactData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        category: document.getElementById('category').value.trim()
    };
    
    try {
        if (isEditing) {
            const id = document.getElementById('contactId').value;
            await updateContact(id, contactData);
        } else {
            await createContact(contactData);
        }
        
        closeModal();
        loadContacts();
    } catch (error) {
        // Error already handled in API functions
    }
}

function validateForm() {
    clearErrors();
    let isValid = true;
    
    const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'category'];
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showFieldError(field, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            isValid = false;
        }
    });
    
    // Validate email format
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailRegex.test(emailInput.value)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const input = document.getElementById(field);
    const errorSpan = document.getElementById(field + 'Error');
    input.classList.add('error');
    errorSpan.textContent = message;
    errorSpan.classList.add('show');
}

function clearErrors() {
    const inputs = contactForm.querySelectorAll('input, select');
    inputs.forEach(input => input.classList.remove('error'));
    
    const errors = contactForm.querySelectorAll('.error-message');
    errors.forEach(error => error.classList.remove('show'));
}

// Search Functions
function handleSearch() {
    const query = searchInput.value.trim();
    loadContacts(query || null);
}

function handleClearSearch() {
    searchInput.value = '';
    loadContacts();
}

// Delete Function (global scope for onclick)
async function deleteContactById(id) {
    try {
        await deleteContact(id);
        loadContacts();
    } catch (error) {
        // Error already handled
    }
}

// Utility Functions
function showMessage(message, type) {
    messageArea.innerHTML = `<div class="${type}">${escapeHtml(message)}</div>`;
    
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Window click to close modal
document.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        closeModal();
    }
});
