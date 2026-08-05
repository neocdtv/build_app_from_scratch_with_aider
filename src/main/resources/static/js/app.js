const API_BASE_URL = '/api/contacts';

// Load all contacts on page load
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

async function loadContacts(search = '', category = '') {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        
        const response = await fetch(`${API_BASE_URL}?${params}`);
        if (!response.ok) throw new Error('Failed to load contacts');
        
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        showError(error.message);
    }
}

function displayContacts(contacts) {
    const container = document.getElementById('contactList');
    
    if (contacts.length === 0) {
        container.innerHTML = '<p>No contacts found. Add your first contact!</p>';
        return;
    }
    
    container.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <div class="contact-header">
                <span class="contact-name">${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</span>
                <div class="contact-actions">
                    <button class="edit-btn" onclick="openEditModal(${contact.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
            <div class="contact-details">
                ${contact.email ? `<p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>` : ''}
                ${contact.phoneNumber ? `<p><strong>Phone:</strong> ${escapeHtml(contact.phoneNumber)}</p>` : ''}
                ${contact.address ? `<p><strong>Address:</strong> ${escapeHtml(contact.address)}</p>` : ''}
                ${contact.category ? `<p><strong>Category:</strong> ${escapeHtml(contact.category)}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    loadContacts(searchTerm, categoryFilter);
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add Contact';
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('contactModal').style.display = 'block';
}

async function openEditModal(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to load contact');
        
        const contact = await response.json();
        document.getElementById('modalTitle').textContent = 'Edit Contact';
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName || '';
        document.getElementById('lastName').value = contact.lastName || '';
        document.getElementById('email').value = contact.email || '';
        document.getElementById('phoneNumber').value = contact.phoneNumber || '';
        document.getElementById('address').value = contact.address || '';
        document.getElementById('category').value = contact.category || '';
        document.getElementById('contactModal').style.display = 'block';
    } catch (error) {
        showError(error.message);
    }
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
    document.getElementById('contactForm').reset();
}

async function handleSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('contactId').value;
    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value || null
    };
    
    try {
        const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save contact');
        }
        
        showSuccess(id ? 'Contact updated successfully!' : 'Contact added successfully!');
        closeModal();
        loadContacts();
    } catch (error) {
        showError(error.message);
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete contact');
        
        showSuccess('Contact deleted successfully!');
        loadContacts();
    } catch (error) {
        showError(error.message);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Add form submission listener
document.getElementById('contactForm').addEventListener('submit', handleSubmit);

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeModal();
    }
}
