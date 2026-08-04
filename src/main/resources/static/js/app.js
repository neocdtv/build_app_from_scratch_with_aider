const API_BASE = '/api/contacts';

let contacts = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('searchBtn').addEventListener('click', searchContacts);
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    });
    document.getElementById('firstName').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    });
    document.getElementById('lastName').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    });
    document.getElementById('category').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    });
}

async function loadContacts() {
    try {
        const response = await fetch(API_BASE);
        contacts = await response.json();
        renderContacts();
    } catch (error) {
        showError('Failed to load contacts');
    }
}

async function searchContacts() {
    const search = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;
    try {
        const response = await fetch(`${API_BASE}?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
        contacts = await response.json();
        renderContacts();
    } catch (error) {
        showError('Failed to search contacts');
    }
}

function renderContacts() {
    const container = document.getElementById('contactList');
    if (contacts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No contacts found</h3><p>Click "Add Contact" to create one</p></div>';
        return;
    }
    container.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <div class="contact-info">
                <h3>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</h3>
                <p>${escapeHtml(contact.email)}</p>
                <p>${escapeHtml(contact.phoneNumber)}</p>
                <p>${escapeHtml(contact.address || 'No address')}</p>
                <span class="category">${escapeHtml(contact.category || 'Uncategorized')}</span>
            </div>
            <div class="contact-actions">
                <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

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

    try {
        const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
        const method = editingId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeModal();
            loadContacts();
            showError('');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save contact');
        }
    } catch (error) {
        showError('Failed to save contact');
    }
}

async function editContact(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        const contact = await response.json();
        editingId = id;
        document.getElementById('contactId').value = id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address || '';
        document.getElementById('category').value = contact.category || '';
        document.getElementById('modalTitle').textContent = 'Edit Contact';
        document.getElementById('modal').classList.add('active');
    } catch (error) {
        showError('Failed to load contact');
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
        const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadContacts();
        } else {
            showError('Failed to delete contact');
        }
    } catch (error) {
        showError('Failed to delete contact');
    }
}

function openModal() {
    editingId = null;
    document.getElementById('contactForm').reset();
    document.getElementById('modalTitle').textContent = 'Add Contact';
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    editingId = null;
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.classList.add('active');
    setTimeout(() => error.classList.remove('active'), 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
