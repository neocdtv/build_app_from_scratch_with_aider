const API_BASE = '/api/contacts';
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();

    document.getElementById('search-btn').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        loadContacts(query);
    });

    document.getElementById('add-contact-btn').addEventListener('click', () => {
        openForm();
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        closeForm();
    });

    document.getElementById('contact-form-el').addEventListener('submit', (e) => {
        e.preventDefault();
        saveContact();
    });
});

async function loadContacts(query = '') {
    const tbody = document.getElementById('contacts-body');
    tbody.innerHTML = '';

    let url = API_BASE;
    if (query) {
        url += `/search?q=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        const contacts = await response.json();
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName}</td>
                <td>${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.address}</td>
                <td>${contact.category}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="openForm(${JSON.stringify(contact)})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        loadContacts(document.getElementById('search-input').value);
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

function openForm(contact = null) {
    const form = document.getElementById('contact-form');
    const title = document.getElementById('form-title');
    
    if (contact) {
        editingId = contact.id;
        title.textContent = 'Edit Contact';
        document.getElementById('first-name').value = contact.firstName;
        document.getElementById('last-name').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone-number').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
    } else {
        editingId = null;
        title.textContent = 'Add Contact';
        document.getElementById('contact-form-el').reset();
    }
    
    form.classList.remove('hidden');
}

function closeForm() {
    const form = document.getElementById('contact-form');
    form.classList.add('hidden');
    editingId = null;
    document.getElementById('contact-form-el').reset();
}

async function saveContact() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const address = document.getElementById('address').value.trim();
    const category = document.getElementById('category').value.trim();

    if (!firstName || !lastName || !email || !phoneNumber || !address || !category) {
        alert('Please fill in all fields.');
        return;
    }

    const contactData = {
        firstName, lastName, email, phoneNumber, address, category
    };

    try {
        let url = API_BASE;
        let method = 'POST';
        
        if (editingId) {
            url += `/${editingId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            closeForm();
            loadContacts(document.getElementById('search-input').value);
        } else {
            const error = await response.json();
            alert('Error saving contact: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving contact:', error);
    }
}
