const API_BASE_URL = '/api/contacts';

let allContacts = [];
let editingContactId = null;
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const contactsBody = document.getElementById('contactsBody');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderContacts();
    });

    contactForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });
}

async function loadContacts() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to load contacts');
        allContacts = await response.json();
        renderContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
        document.getElementById('contactsBody').innerHTML = '<tr><td colspan="5" class="loading">Error loading contacts. Please try again.</td></tr>';
    }
}

function renderContacts() {
    const contactsBody = document.getElementById('contactsBody');
    const searchTerm = searchQuery;

    if (searchTerm) {
        const filteredContacts = allContacts.filter(contact => 
            contact.myName.toLowerCase().includes(searchTerm) ||
            contact.category.toLowerCase().includes(searchTerm)
        );
        displayContacts(filteredContacts);
    } else {
        displayContacts(allContacts);
    }
}

function displayContacts(contacts) {
    const contactsBody = document.getElementById('contactsBody');

    if (contacts.length === 0) {
        contactsBody.innerHTML = '<tr><td colspan="5" class="loading">No contacts found</td></tr>';
        return;
    }

    contactsBody.innerHTML = contacts.map(contact => `
        <tr data-id="${contact.id}">
            <td>${contact.myName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.category}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        myName: document.getElementById('myName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    // Client-side validation
    if (!validateForm(formData)) {
        return;
    }

    try {
        let response;
        if (editingContactId) {
            response = await fetch(`${API_BASE_URL}/${editingContactId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (response.ok) {
            const updatedContact = response.json();
            allContacts = [updatedContact, ...allContacts.filter(c => c.id !== editingContactId)];
            resetForm();
            renderContacts();
            showSuccess('Contact saved successfully!');
        } else {
            throw new Error('Failed to save contact');
        }
    } catch (error) {
        console.error('Error saving contact:', error);
        showError('Failed to save contact. Please try again.');
    }
}

function validateForm(formData) {
    if (!formData.myName || formData.myName.length < 2) {
        showError('First name must be at least 2 characters');
        return false;
    }
    if (!formData.lastName || formData.lastName.length < 2) {
        showError('Last name must be at least 2 characters');
        return false;
    }
    if (!formData.email || !isValidEmail(formData.email)) {
        showError('Please enter a valid email address');
        return false;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 7) {
        showError('Phone number must be at least 7 characters');
        return false;
    }
    if (!formData.address || formData.address.length < 5) {
        showError('Address must be at least 5 characters');
        return false;
    }
    if (!formData.category || formData.category.length < 2) {
        showError('Category must be at least 2 characters');
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function editContact(id) {
    const contact = allContacts.find(c => c.id === id);
    if (!contact) return;

    editingContactId = id;
    document.getElementById('contactId').value = id;
    document.getElementById('myName').value = contact.myName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;

    document.getElementById('formTitle').textContent = 'Edit Contact';
    document.getElementById('submitBtn').textContent = 'Update Contact';
    document.getElementById('submitBtn').classList.remove('btn-primary');
    document.getElementById('submitBtn').classList.add('btn-secondary');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            allContacts = allContacts.filter(c => c.id !== id);
            renderContacts();
            showSuccess('Contact deleted successfully!');
        } else {
            throw new Error('Failed to delete contact');
        }
    })
    .catch(error => {
        console.error('Error deleting contact:', error);
        showError('Failed to delete contact. Please try again.');
    });
}

function resetForm() {
    document.getElementById('contactForm').reset();
    editingContactId = null;
    document.getElementById('formTitle').textContent = 'Add Contact';
    document.getElementById('submitBtn').textContent = 'Add Contact';
    document.getElementById('submitBtn').classList.remove('btn-secondary');
    document.getElementById('submitBtn').classList.add('btn-primary');
}

function showSuccess(message) {
    const div = document.createElement('div');
    div.className = 'success-message';
    div.textContent = message;
    div.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function showError(message) {
    const div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;
    div.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
