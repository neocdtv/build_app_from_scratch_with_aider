const API_URL = '/api/contacts';

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

async function loadContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        const tbody = document.getElementById('contactsBody');
        tbody.innerHTML = '';

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
                    <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function searchContacts() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        loadContacts();
        return;
    }
    try {
        const response = await fetch(`${API_URL}/search?q=${query}`);
        const contacts = await response.json();
        const tbody = document.getElementById('contactsBody');
        tbody.innerHTML = '';

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
                    <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching contacts:', error);
    }
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            });
        }
        if (response.ok) {
            resetForm();
            loadContacts();
        } else {
            alert('Error saving contact');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function editContact(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(contact => {
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address;
            document.getElementById('category').value = contact.category;
            
            document.getElementById('formTitle').innerText = 'Edit Contact';
            document.getElementById('submitBtn').innerText = 'Update';
            document.getElementById('cancelBtn').style.display = 'inline-block';
        });
}

async function deleteContact(id) {
    if(confirm('Are you sure you want to delete this contact?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadContacts();
    }
}

function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('formTitle').innerText = 'Add New Contact';
    document.getElementById('submitBtn').innerText = 'Save';
    document.getElementById('cancelBtn').style.display = 'none';
}
