let currentId = null;

const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const searchInput = document.getElementById('searchInput');
const cancelButton = document.getElementById('cancelButton');

document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();

    contactForm.addEventListener('submit', saveContact);
    searchInput.addEventListener('input', (e) => fetchContacts(e.target.value));
    cancelButton.addEventListener('click', resetForm);
    contactList.addEventListener('click', handleListClick);
});

async function fetchContacts(searchQuery = '') {
    try {
        const response = await fetch(`/api/contacts?search=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Error:', error);
        contactList.innerHTML = '<p style="color: red;">Error loading contacts.</p>';
    }
}

function renderContacts(contacts) {
    if (contacts.length === 0) {
        contactList.innerHTML = '<p>No contacts found.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    contacts.forEach(contact => {
        html += `
            <tr>
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.category || ''}</td>
                <td>
                    <button class="btn-edit" data-id="${contact.id}">Edit</button>
                    <button class="btn-delete" data-id="${contact.id}">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    contactList.innerHTML = html;
}

async function saveContact(event) {
    event.preventDefault();

    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        const method = currentId ? 'PUT' : 'POST';
        const url = currentId ? `/api/contacts/${currentId}` : '/api/contacts';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || 'Failed to save contact');
        }

        resetForm();
        fetchContacts(searchInput.value);
    } catch (error) {
        alert('Error saving contact: ' + error.message);
    }
}

function handleListClick(event) {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains('btn-edit')) {
        editContact(id);
    } else if (event.target.classList.contains('btn-delete')) {
        if (confirm('Are you sure you want to delete this contact?')) {
            deleteContact(id);
        }
    }
}

async function editContact(id) {
    try {
        const response = await fetch(`/api/contacts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch contact details');
        const contact = await response.json();

        currentId = contact.id;
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber || '';
        document.getElementById('address').value = contact.address || '';
        document.getElementById('category').value = contact.category || '';

        cancelButton.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        alert('Error editing contact: ' + error.message);
    }
}

async function deleteContact(id) {
    try {
        const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete contact');
        fetchContacts(searchInput.value);
    } catch (error) {
        alert('Error deleting contact: ' + error.message);
    }
}

function resetForm() {
    currentId = null;
    contactForm.reset();
    document.getElementById('contactId').value = '';
    cancelButton.classList.add('hidden');
}
