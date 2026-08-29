const API_BASE_URL = '/api/contacts';
let contacts = [];

// DOM Elements
const contactForm = document.getElementById('contact-form');
const contactIdInput = document.getElementById('contact-id');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const categoryInput = document.getElementById('category');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const contactsContainer = document.getElementById('contacts-container');
const formTitle = document.getElementById('form-title');

// Load contacts on page load
document.addEventListener('DOMContentLoaded', loadContacts);

// Load and display all contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE_URL}`);
        if (response.ok) {
            contacts = await response.json();
            displayContacts(contacts);
        } else {
            showErrorMessage('Failed to load contacts');
        }
    } catch (error) {
        showErrorMessage('Error loading contacts: ' + error.message);
    }
}

// Handle form submission
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const contactData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        phoneNumber: phoneInput.value.trim(),
        address: addressInput.value.trim(),
        category: categoryInput.value.trim()
    };
    
    // Client-side validation
    if (!validateForm(contactData)) {
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
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            resetForm();
            loadContacts();
        } else {
            showErrorMessage('Failed to save contact. Please try again.');
        }
    } catch (error) {
        showErrorMessage('Error saving contact: ' + error.message);
    }
});

// Validate form data
function validateForm(contactData) {
    const requiredFields = [
        { field: 'firstName', message: 'First name is required' },
        { field: 'lastName', message: 'Last name is required' },
        { field: 'email', message: 'Email is required' },
        { field: 'phoneNumber', message: 'Phone number is required' },
        { field: 'address', message: 'Address is required' },
        { field: 'category', message: 'Category is required' }
    ];
    
    for (const { field, message } of requiredFields) {
        const value = contactData[field];
        if (!value || value.trim() === '') {
            alert(message);
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Handle search
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (query === '') {
        loadContacts();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const results = await response.json();
            displayContacts(results);
        } else {
            showErrorMessage('Failed to search contacts');
        }
    } catch (error) {
        showErrorMessage('Error searching contacts: ' + error.message);
    }
}

// Display contacts
function displayContacts(contactList) {
    if (contactList.length === 0) {
        contactsContainer.innerHTML = '<div class="loading">No contacts found</div>';
        return;
    }
    
    contactsContainer.innerHTML = contactList.map(contact => `
        <div class="contact-card">
            <h3>${contact.firstName} ${contact.lastName}</h3>
            <div class="contact-info">
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Phone:</strong> ${contact.phoneNumber}</p>
                <p><strong>Address:</strong> ${contact.address}</p>
                <p><strong>Category:</strong> ${contact.category}</p>
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit contact
async function editContact(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (response.ok) {
            const contact = await response.json();
            contactIdInput.value = contact.id;
            firstNameInput.value = contact.firstName;
            lastNameInput.value = contact.lastName;
            emailInput.value = contact.email;
            phoneInput.value = contact.phoneNumber;
            addressInput.value = contact.address;
            categoryInput.value = contact.category;
            
            formTitle.textContent = 'Edit Contact';
            submitBtn.textContent = 'Update Contact';
            cancelBtn.classList.remove('hidden');
        } else {
            showErrorMessage('Failed to load contact');
        }
    } catch (error) {
        showErrorMessage('Error loading contact: ' + error.message);
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
            loadContacts();
            showSuccessMessage('Contact deleted successfully');
        } else {
            showErrorMessage('Failed to delete contact');
        }
    } catch (error) {
        showErrorMessage('Error deleting contact: ' + error.message);
    }
}

// Reset form
function resetForm() {
    contactForm.reset();
    contactIdInput.value = '';
    formTitle.textContent = 'Add New Contact';
    submitBtn.textContent = 'Add Contact';
    cancelBtn.classList.add('hidden');
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    contactsContainer.insertBefore(errorDiv, contactsContainer.firstChild);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'error-message show';
    successDiv.style.background = '#d4edda';
    successDiv.style.borderColor = '#c3e6cb';
    successDiv.style.color = '#155724';
    successDiv.textContent = message;
    
    contactsContainer.insertBefore(successDiv, contactsContainer.firstChild);
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}
