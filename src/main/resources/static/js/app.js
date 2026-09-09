const API_BASE_URL = '/api/contacts';

let editingContactId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
});

function loadContacts() {
    fetch(`${API_BASE_URL}?q=`)
        .then(response => response.json())
        .then(contacts => {
            displayContacts(contacts);
        })
        .catch(error => {
            console.error('Error loading contacts:', error);
            showError('Failed to load contacts');
        });
}

function displayContacts(contacts) {
    const contactsBody = document.getElementById('contactsBody');
    
    if (contacts.length === 0) {
        contactsBody.innerHTML = '<tr><td colspan="5" class="empty-message">No contacts found</td></tr>';
        return;
    }
    
    contactsBody.innerHTML = contacts.map(contact => `
        <tr>
            <td>${escapeHtml(contact.firstName || '')} ${escapeHtml(contact.lastName || '')}</td>
            <td>${escapeHtml(contact.email || '')}</td>
            <td>${escapeHtml(contact.phoneNumber || '')}</td>
            <td>${escapeHtml(contact.category || '')}</td>
            <td>
                <div class="action-buttons">
                    <button type="button" class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button type="button" class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };
    
    const contactId = document.getElementById('contactId').value;
    
    if (contactId) {
        // Update existing contact
        updateContact(contactId, contact);
    } else {
        // Create new contact
        createContact(contact);
    }
}

function createContact(contact) {
    fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create contact');
        }
        return response.json();
    })
    .then(contact => {
        showSuccess('Contact created successfully');
        resetForm();
        loadContacts();
    })
    .catch(error => {
        console.error('Error creating contact:', error);
        showError('Failed to create contact');
    });
}

function updateContact(id, contact) {
    fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
        return response.json();
    })
    .then(contact => {
        showSuccess('Contact updated successfully');
        resetForm();
        loadContacts();
    })
    .catch(error => {
        console.error('Error updating contact:', error);
        showError('Failed to update contact');
    });
}

function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
    })
    .then(() => {
        showSuccess('Contact deleted successfully');
        loadContacts();
    })
    .catch(error => {
        console.error('Error deleting contact:', error);
        showError('Failed to delete contact');
    });
}

function editContact(id) {
    fetch(`${API_BASE_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Contact not found');
            }
            return response.json();
        })
        .then(contact => {
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address;
            document.getElementById('category').value = contact.category;
            
            document.getElementById('formTitle').textContent = 'Edit Contact';
            document.getElementById('submitBtn').textContent = 'Update Contact';
            document.getElementById('cancelBtn').style.display = 'inline-block';
            
            editingContactId = id;
            window.scrollTo(0, 0);
        })
        .catch(error => {
            console.error('Error loading contact:', error);
            showError('Failed to load contact for editing');
        });
}

function cancelEdit() {
    resetForm();
    editingContactId = null;
    document.getElementById('formTitle').textContent = 'Add Contact';
    document.getElementById('submitBtn').textContent = 'Add Contact';
    document.getElementById('cancelBtn').style.display = 'none';
}

function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
}

function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    
    if (query) {
        fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(contacts => {
                displayContacts(contacts);
                document.getElementById('formTitle').textContent = 'Add Contact';
                document.getElementById('submitBtn').textContent = 'Add Contact';
                document.getElementById('cancelBtn').style.display = 'none';
            })
            .catch(error => {
                console.error('Error searching contacts:', error);
                showError('Failed to search contacts');
            });
    }
}

function showError(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    const formSection = document.querySelector('.add-form-section');
    formSection.insertBefore(messageDiv, formSection.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    const formSection = document.querySelector('.add-form-section');
    formSection.insertBefore(messageDiv, formSection.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
