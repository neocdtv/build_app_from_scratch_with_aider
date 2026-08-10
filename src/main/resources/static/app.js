document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();
});

async function fetchContacts() {
    try {
        const response = await fetch('/api/contacts');
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error(error);
        alert('Error fetching contacts: ' + error.message);
    }
}

function renderContacts(contacts) {
    const tableBody = document.getElementById('contactsTableBody');
    tableBody.innerHTML = '';

    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${escapeHtml(contact.firstName)}</td>
            <td>${escapeHtml(contact.lastName)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phoneNumber)}</td>
            <td>${escapeHtml(contact.address)}</td>
            <td>${escapeHtml(contact.category)}</td>
            <td>
                <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

async function searchContacts() {
    const query = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search contacts');
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error(error);
        alert('Error searching contacts: ' + error.message);
    }
}

async function createContact(contact) {
    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
        if (!response.ok) throw new Error('Failed to create contact');
        fetchContacts();
        closeModal();
    } catch (error) {
        console.error(error);
        alert('Error creating contact: ' + error.message);
    }
}

async function updateContact(contact) {
    try {
        const response = await fetch(`/api/contacts/${contact.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });
        if (!response.ok) throw new Error('Failed to update contact');
        fetchContacts();
        closeModal();
    } catch (error) {
        console.error(error);
        alert('Error updating contact: ' + error.message);
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
        const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete contact');
        fetchContacts();
    } catch (error) {
        console.error(error);
        alert('Error deleting contact: ' + error.message);
    }
}

function openModal() {
    document.getElementById('contactId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Contact';
    document.getElementById('submitBtn').textContent = 'Save';
    document.getElementById('contactForm').reset();
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
}

async function editContact(id) {
    try {
        const response = await fetch(`/api/contacts/${id}`);
        if (!response.ok) throw new Error('Failed to get contact');
        const contact = await response.json();
        
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        
        document.getElementById('modalTitle').textContent = 'Edit Contact';
        document.getElementById('submitBtn').textContent = 'Update';
        document.getElementById('contactModal').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Error editing contact: ' + error.message);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('contactId').value;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('address').value.trim();
    const category = document.getElementById('category').value.trim();

    // Client-side validation before API call
    if (!firstName || !lastName || !email || !phoneNumber || !address || !category) {
        alert('All fields are required.');
        return;
    }

    const contact = { firstName, lastName, email, phoneNumber, address, category };
    
    if (id) {
        contact.id = parseInt(id);
        await updateContact(contact);
    } else {
        await createContact(contact);
    }
}
