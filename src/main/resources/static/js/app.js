const API_BASE_URL = '/api/contacts';

let contacts = [];

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
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
        showError(errors.join(', '));
        return;
    }

    const contactId = document.getElementById('contactId').value;
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;

    try {
        submitBtn.disabled = true;
        
        if (contactId) {
            // Update existing contact
            await updateContact(contactId, formData);
        } else {
            // Create new contact
            await createContact(formData);
        }
        
        resetForm();
        loadContacts();
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to save contact. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Create contact
async function createContact(contactData) {
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    });

    if (!response.ok) {
        throw new Error('Failed to create contact');
    }

    const contact = await response.json();
    return contact;
}

// Update contact
async function updateContact(id, contactData) {
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

    const contact = await response.json();
    return contact;
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

        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }

        loadContacts();
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to delete contact. Please try again.');
    }
}

// Load all contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        
        if (!response.ok) {
            throw new Error('Failed to load contacts');
        }

        contacts = await response.json();
        renderContacts();
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load contacts. Please try again.');
    }
}

// Search contacts
async function searchContacts(query) {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('contactsContainer');

    if (!query || query.trim() === '') {
        loadContacts();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Failed to search contacts');
        }

        const results = await response.json();
        renderContacts(results);
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to search contacts. Please try again.');
    }
}

// Render contacts
function renderContacts(contactList = contacts) {
    const container = document.getElementById('contactsContainer');
    container.innerHTML = '';

    if (contactList.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No contacts found.</p>';
        return;
    }

    contactList.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <h3>${contact.firstName} ${contact.lastName}</h3>
            <div class="info">📧 ${contact.email}</div>
            <div class="info">📱 ${contact.phoneNumber}</div>
            <div class="info">📍 ${contact.address}</div>
            <div class="info">🏷️ ${contact.category}</div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Edit contact
function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    document.getElementById('contactId').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;

    document.getElementById('formTitle').textContent = 'Edit Contact';
    document.getElementById('submitBtn').textContent = 'Update Contact';
    document.getElementById('cancelBtn').classList.remove('hidden');

    const form = document.getElementById('contactForm');
    form.style.display = 'block';
}

// Cancel/Reset form
function resetForm() {
    document.getElementById('contactId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('address').value = '';
    document.getElementById('category').value = '';

    document.getElementById('formTitle').textContent = 'Add Contact';
    document.getElementById('submitBtn').textContent = 'Add Contact';
    document.getElementById('cancelBtn').classList.add('hidden');

    const form = document.getElementById('contactForm');
    form.style.display = 'block';
}

// Validate form
function validateForm(formData) {
    const errors = [];
    
    if (!formData.firstName || formData.firstName.trim().length === 0) {
        errors.push('First name is required');
    }
    if (!formData.lastName || formData.lastName.trim().length === 0) {
        errors.push('Last name is required');
    }
    if (!formData.email || formData.email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!isValidEmail(formData.email)) {
        errors.push('Invalid email format');
    }
    if (!formData.phoneNumber || formData.phoneNumber.trim().length === 0) {
        errors.push('Phone number is required');
    }
    if (!formData.address || formData.address.trim().length === 0) {
        errors.push('Address is required');
    }
    if (!formData.category || formData.category.trim().length === 0) {
        errors.push('Category is required');
    }

    return errors;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(message) {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Enable live search
    document.getElementById('searchInput').addEventListener('keyup', function() {
        searchContacts(this.value);
    });

    // Load contacts on page load
    loadContacts();
});
