document.addEventListener('DOMContentLoaded', function() {
    loadContacts();
    
    // Add form submission handler
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const contactId = document.getElementById('contactId').value;
        
        if (contactId) {
            updateContact(contactId);
        } else {
            addContact();
        }
    });
});

// Load contacts from API
function loadContacts() {
    const searchQuery = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    
    let url = '/api/contacts';
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (category) params.append('category', category);
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    fetch(url)
        .then(response => response.json())
        .then(contacts => {
            displayContacts(contacts);
        })
        .catch(error => {
            console.error('Error loading contacts:', error);
            alert('Error loading contacts. Please try again.');
        });
}

// Display contacts in table
function displayContacts(contacts) {
    const tableBody = document.getElementById('contactsTableBody');
    tableBody.innerHTML = '';
    
    if (contacts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No contacts found</td></tr>';
        return;
    }
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${contact.firstName} ${contact.lastName}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${contact.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${contact.phoneNumber || 'N/A'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${contact.category || 'Uncategorized'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editContact(${contact.id})" class="btn-edit">Edit</button>
                <button onclick="deleteContact(${contact.id})" class="btn-delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Show add contact modal
function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Contact';
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('contactModal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('contactModal').classList.add('hidden');
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
}

// Add new contact
function addContact() {
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };
    
    fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => {
        if (response.ok) {
            closeModal();
            loadContacts();
        } else {
            alert('Error adding contact. Please check the form data.');
        }
    })
    .catch(error => {
        console.error('Error adding contact:', error);
        alert('Error adding contact. Please try again.');
    });
}

// Edit contact
function editContact(id) {
    fetch(`/api/contacts/${id}`)
        .then(response => response.json())
        .then(contact => {
            document.getElementById('modalTitle').textContent = 'Edit Contact';
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber || '';
            document.getElementById('address').value = contact.address || '';
            document.getElementById('category').value = contact.category || 'Family';
            document.getElementById('contactModal').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error loading contact:', error);
            alert('Error loading contact. Please try again.');
        });
}

// Update contact
function updateContact(id) {
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };
    
    fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => {
        if (response.ok) {
            closeModal();
            loadContacts();
        } else {
            alert('Error updating contact. Please check the form data.');
        }
    })
    .catch(error => {
        console.error('Error updating contact:', error);
        alert('Error updating contact. Please try again.');
    });
}

// Delete contact
function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadContacts();
            } else {
                alert('Error deleting contact.');
            }
        })
        .catch(error => {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact. Please try again.');
        });
    }
}

// Add search functionality
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        loadContacts();
    }
});

document.getElementById('categoryFilter').addEventListener('change', function() {
    loadContacts();
});
