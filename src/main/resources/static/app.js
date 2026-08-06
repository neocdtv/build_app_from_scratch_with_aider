const API_URL = '/api/contacts';

document.addEventListener('DOMContentLoaded', loadContacts);

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const contactId = document.getElementById('contactId').value;
    const contactData = Object.fromEntries(formData.entries());

    if (contactId) {
        updateContact(contactId, contactData);
    } else {
        createContact(contactData);
    }
});

async function loadContacts(query = '') {
    let url = API_URL;
    if (query) url += `/search?q=${query}`;
    
    try {
        const response = await fetch(url);
        const contacts = await response.json();
        renderContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function renderContacts(contacts) {
    const tbody = document.getElementById('contactsBody');
    tbody.innerHTML = '';
    contacts.forEach(contact => {
        const row = `
            <tr>
                <td>${contact.firstName}</td>
                <td>${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.category}</td>
                <td>
                    <button class="btn-edit" onclick='editContact(${JSON.stringify(contact)})'>Edit</button>
                    <button class="btn-danger" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function createContact(contactData) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        closeModal();
        loadContacts();
    } catch (error) {
        alert('Failed to add contact');
    }
}

async function updateContact(id, contactData) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        closeModal();
        loadContacts();
    } catch (error) {
        alert('Failed to update contact');
    }
}

async function deleteContact(id) {
    if(confirm('Are you sure you want to delete this contact?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadContacts();
        } catch (error) {
            alert('Failed to delete contact');
        }
    }
}

function searchContacts() {
    const query = document.getElementById('searchInput').value;
    loadContacts(query);
}

function openModal() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('modalTitle').innerText = 'Add Contact';
    document.getElementById('contactModal').style.display = "block";
}

function closeModal() {
    document.getElementById('contactModal').style.display = "none";
}

function editContact(contact) {
    document.getElementById('contactId').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;
    
    document.getElementById('modalTitle').innerText = 'Edit Contact';
    document.getElementById('contactModal').style.display = "block";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('contactModal')) {
        closeModal();
    }
}
