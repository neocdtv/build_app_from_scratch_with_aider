const API_BASE_URL = '/api/contacts';

// DOM Elements
const contactForm = document.getElementById('contactForm');
const contactIdInput = document.getElementById('contactId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneNumberInput = document.getElementById('phoneNumber');
const addressInput = document.getElementById('address');
const categoryInput = document.getElementById('category');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const contactsContainer = document.getElementById('contactsContainer');

// Load contacts on page load
document.addEventListener('DOMContentLoaded', loadContacts);

// Load all contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        showError('Failed to load contacts. Please try again later.');
    }
}

// Display contacts in grid
function displayContacts(contacts) {
    contactsContainer.innerHTML = '';
    
    if (contacts.length === 0) {
        contactsContainer.innerHTML = '<div class="loading">No contacts found.</div>';
        return;
    }

    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <h3>${contact.firstName} ${contact.lastName}</h3>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phoneNumber}</p>
            <p><strong>Address:</strong> ${contact.address}</p>
            <p><strong>Category:</strong> ${contact.category}</p>
            <div class="contact-id">ID: ${contact.id}</div>
            <div class="contact-actions">
                <button class="edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        contactsContainer.appendChild(card);
    });
}

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        phoneNumber: phoneNumberInput.value.trim(),
        address: addressInput.value.trim(),
        category: categoryInput.value.trim()
    };

    if (!validateForm(formData)) {
        showError('Please fill in all required fields with valid data.');
        return;
    }

    try {
        const url = contactIdInput.value ? `${API_BASE_URL}/${contactIdInput.value}` : API_BASE_URL;
        const method = contactIdInput.value ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showSuccess('Contact saved successfully!');
            contactForm.reset();
            contactIdInput.value = '';
            contactIdInput.parentElement.classList.add('hidden');
            loadContacts();
        } else {
            const errorData = await response.json();
            showError(errorData.message || 'Failed to save contact.');
        }
    } catch (error) {
        showError('Failed to save contact. Please try again later.');
    }
});

// Edit contact
async function editContact(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const contact = await response.json();

        contactIdInput.value = contact.id;
        firstNameInput.value = contact.firstName || '';
        lastNameInput.value = contact.lastName || '';
        emailInput.value = contact.email || '';
        phoneNumberInput.value = contact.phoneNumber || '';
        addressInput.value = contact.address || '';
        categoryInput.value = contact.category || '';

        contactIdInput.parentElement.classList.remove('hidden');
        submitBtn.textContent = 'Update Contact';
        cancelBtn.classList.remove('hidden');
    } catch (error) {
        showError('Failed to load contact for editing.');
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
            showSuccess('Contact deleted successfully!');
            loadContacts();
        } else {
            const errorData = await response.json();
            showError(errorData.message || 'Failed to delete contact.');
        }
    } catch (error) {
        showError('Failed to delete contact. Please try again later.');
    }
}

// Search contacts
async function searchContacts() {
    const query = searchInput.value.trim();
    
    if (!query) {
        loadContacts();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        showError('Failed to search contacts. Please try again later.');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    contactsContainer.prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    contactsContainer.prepend(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Validate form data
function validateForm(formData) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'category'];
    
    for (const field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return false;
    }
    
    // Phone validation (basic)
    if (formData.phoneNumber.length < 7) {
        return false;
    }
    
    return true;
}

// Live search on input
searchInput.addEventListener('input', debounce(searchContacts, 300));

// Search button click
searchBtn.addEventListener('click', searchContacts);

// Cancel button click
cancelBtn.addEventListener('click', () => {
    contactForm.reset();
    contactIdInput.value = '';
    contactIdInput.parentElement.classList.add('hidden');
    submitBtn.textContent = 'Save Contact';
    cancelBtn.classList.add('hidden');
});

// Utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
