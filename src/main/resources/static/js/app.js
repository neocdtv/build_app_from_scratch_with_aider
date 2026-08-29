// Contact Management - Frontend Application

let contacts = [];
let editingId = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const contactForm = document.getElementById('contactForm');
const contactsBody = document.getElementById('contactsBody');
const submitText = document.getElementById('submitText');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupEventListeners();
});

// Fetch all contacts on page load
async function loadContacts() {
    try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        
        if (data.error) {
            console.error('Failed to load contacts:', data.error);
            contactsBody.innerHTML = `<div class="empty-state"><p>Failed to load contacts. Please try again later.</p></div>`;
            return;
        }
        
        contacts = data;
        renderContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
        contactsBody.innerHTML = `<div class="empty-state"><p>Unable to load contacts. Please check your connection.</p></div>`;
    }
}

// Render contacts to the table
function renderContacts(filter = '') {
    contactsBody.innerHTML = '';
    
    const filteredContacts = filter 
        ? contacts.filter(contact => 
            contact.firstName.toLowerCase().includes(filter.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(filter.toLowerCase()) ||
            contact.category.toLowerCase().includes(filter.toLowerCase())
          )
        : contacts;
    
    if (filteredContacts.length === 0) {
        contactsBody.innerHTML = `<div class="empty-state"><p>No contacts found.</p></div>`;
        return;
    }
    
    filteredContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.address}</td>
            <td>${contact.category}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editContact(${contact.id})">
                    ✏️ Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteContact(${contact.id})">
                    🗑️ Delete
                </button>
            </td>
        `;
        contactsBody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Live search
    searchInput.addEventListener('input', (e) => {
        renderContacts(e.target.value);
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        address: document.getElementById('address').value.trim(),
        category: document.getElementById('category').value.trim()
    };
    
    // Client-side validation
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Disable form during submission
    contactForm.disabled = true;
    submitText.textContent = 'Saving...';
    
    try {
        let response;
        if (editingId) {
            // Update existing contact
            response = await fetch(`/api/contacts/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new contact
            response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        }
        
        const data = await response.json();
        
        if (data.error) {
            showErrors([data.error]);
        } else {
            contacts = [...contacts];
            if (editingId) {
                const index = contacts.findIndex(c => c.id === editingId);
                if (index !== -1) {
                    contacts[index] = data;
                }
            }
            editingId = null;
            contactForm.reset();
            renderContacts();
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        showErrors(['Failed to save contact. Please try again.']);
    } finally {
        contactForm.disabled = false;
        submitText.textContent = editingId ? 'Update Contact' : 'Add Contact';
    }
}

// Validate form
function validateForm(data) {
    const errors = [];
    
    if (!data.firstName || !data.firstName.trim()) {
        errors.push('First name is required');
    }
    if (!data.lastName || !data.lastName.trim()) {
        errors.push('Last name is required');
    }
    if (!data.email || !data.email.trim()) {
        errors.push('Email is required');
    }
    if (!data.phoneNumber || !data.phoneNumber.trim()) {
        errors.push('Phone number is required');
    }
    if (!data.address || !data.address.trim()) {
        errors.push('Address is required');
    }
    if (!data.category || !data.category.trim()) {
        errors.push('Category is required');
    }
    
    return errors;
}

// Show validation errors
function showErrors(errors) {
    const errorFields = document.querySelectorAll('.form-input');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors.find(e => e.includes(field.id)) || 'Please fix the errors above';
        field.parentNode.appendChild(errorDiv);
    });
}

// Edit a contact
async function editContact(id) {
    try {
        const response = await fetch(`/api/contacts/${id}`);
        const contact = await response.json();
        
        if (contact.error) {
            alert(contact.error);
            return;
        }
        
        editingId = id;
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        
        submitText.textContent = 'Update Contact';
        renderContacts();
    } catch (error) {
        console.error('Error loading contact:', error);
        alert('Failed to load contact. Please try again.');
    }
}

// Delete a contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            contacts = contacts.filter(c => c.id !== id);
            editingId = null;
            contactForm.reset();
            renderContacts();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete contact.');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
    }
}
