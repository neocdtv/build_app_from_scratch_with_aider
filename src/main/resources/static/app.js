const API_BASE = '/api/contacts';

let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

function loadContacts() {
    fetch(API_BASE)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load contacts');
            return res.json();
        })
        .then(data => {
            renderContacts(data);
        })
        .catch(err => {
            showTableMessage('Error loading contacts. Please refresh the page.');
        });
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        loadContacts();
    } else {
        fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to search contacts');
                return res.json();
            })
            .then(data => {
                renderContacts(data);
            })
            .catch(err => {
                showTableMessage('Error searching contacts.');
            });
    }
}

function renderContacts(contacts) {
    const tbody = document.getElementById('contactsTableBody');
    if (!contacts || contacts.length === 0) {
        showTableMessage('No contacts found.');
        return;
    }
    tbody.innerHTML = contacts.map(c => `
        <tr>
            <td><strong>${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</strong></td>
            <td>${escapeHtml(c.email)}</td>
            <td>${escapeHtml(c.phoneNumber)}</td>
            <td>${escapeHtml(c.address)}</td>
            <td>${escapeHtml(c.category)}</td>
            <td>
                <div class="actions-group">
                    <button class="btn btn-edit" onclick="editContact(${c.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteContact(${c.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showTableMessage(message) {
    document.getElementById('contactsTableBody').innerHTML =
        `<tr><td colspan="6" class="empty-message">${escapeHtml(message)}</td></tr>`;
}

function resetForm() {
    document.getElementById('contactForm').reset();
    editingId = null;
    document.getElementById('formTitle').textContent = 'Add New Contact';
    document.getElementById('formError').className = 'error-message hidden';
    document.getElementById('formContainer').className = 'form-container';
}

function showForm() {
    document.getElementById('formContainer').className = 'form-container';
}

function hideForm() {
    document.getElementById('formContainer').className = 'form-container hidden';
}

function handleFormSubmit() {
    const formData = new FormData(document.getElementById('contactForm'));
    const contact = {
        firstName: formData.get('firstName').trim(),
        lastName: formData.get('lastName').trim(),
        email: formData.get('email').trim(),
        phoneNumber: formData.get('phoneNumber').trim(),
        address: formData.get('address').trim(),
        category: formData.get('category').trim()
    };

    // Client-side validation
    if (!contact.firstName || contact.firstName.length > 50) {
        return showError('First name is required and must be 50 characters or fewer.');
    }
    if (!contact.lastName || contact.lastName.length > 50) {
        return showError('Last name is required and must be 50 characters or fewer.');
    }
    if (!contact.email || contact.email.length > 100 || !isValidEmail(contact.email)) {
        return showError('A valid email address is required.');
    }
    if (!contact.phoneNumber || contact.phoneNumber.length > 20) {
        return showError('Phone number is required and must be 20 characters or fewer.');
    }
    if (!contact.address || contact.address.length > 255) {
        return showError('Address is required and must be 255 characters or fewer.');
    }
    if (!contact.category || contact.category.length > 50) {
        return showError('Category is required and must be 50 characters or fewer.');
    }

    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText || 'Request failed');
            }
            return res.json();
        })
        .then(saved => {
            hideForm();
            resetFormState();
            loadContacts();
        })
        .catch(err => {
            showError('Failed to save contact. Please try again.');
        });
}

function editContact(id) {
    fetch(`${API_BASE}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load contact');
            return res.json();
        })
        .then(contact => {
            editingId = id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address;
            document.getElementById('category').value = contact.category;
            document.getElementById('formTitle').textContent = 'Edit Contact';
            document.getElementById('formError').className = 'error-message hidden';
            showForm();
        })
        .catch(err => {
            showTableMessage('Error loading contact for editing.');
        });
}

function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
        .then(res => {
            if (res.status === 204) {
                if (editingId === id) {
                    hideForm();
                    resetFormState();
                }
                loadContacts();
            } else {
                throw new Error('Failed to delete contact');
            }
        })
        .catch(err => {
            showTableMessage('Error deleting contact.');
        });
}

function resetFormState() {
    document.getElementById('contactForm').reset();
    editingId = null;
    document.getElementById('formTitle').textContent = 'Add New Contact';
}

function showError(message) {
    const errEl = document.getElementById('formError');
    errEl.textContent = message;
    errEl.className = 'error-message';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
