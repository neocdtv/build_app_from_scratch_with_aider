let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();

    document.getElementById('contactForm').addEventListener('submit', saveContact);
});

async function loadContacts(query = '') {
    const url = query ? `/api/contacts/search?q=${encodeURIComponent(query)}` : '/api/contacts';
    try {
        const response = await fetch(url);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function displayContacts(contacts) {
    const container = document.getElementById('contactList');
    container.innerHTML = '';

    if (contacts.length === 0) {
        container.innerHTML = '<p>No contacts found.</p>';
        return;
    }

    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <h3>${contact.firstName} ${contact.lastName}</h3>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phoneNumber}</p>
            <p><strong>Address:</strong> ${contact.address}</p>
            <span class="category">${contact.category}</span>
            <div class="contact-actions">
                <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function saveContact(event) {
    event.preventDefault();

    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            resetForm();
            loadContacts();
        } else {
            const errorData = await response.json();
            alert('Error saving contact: ' + JSON.stringify(errorData.errors || errorData));
        }
    } catch (error) {
        console.error('Error saving contact:', error);
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
        const response = await fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadContacts();
        } else {
            alert('Error deleting contact.');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

function editContact(id) {
    // We need to fetch the individual contact to populate the form correctly
    fetch(`/api/contacts/${id}`)
        .then(response => response.json())
        .then(contact => {
            editingId = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address;
            document.getElementById('category').value = contact.category;

            document.getElementById('formTitle').innerText = 'Edit Contact';
            document.getElementById('submitBtn').innerText = 'Update Contact';
            document.getElementById('cancelBtn').style.display = 'inline-block';
        })
        .catch(error => console.error('Error fetching contact for editing:', error));
}

function resetForm() {
    editingId = null;
    document.getElementById('contactForm').reset();
    document.getElementById('formTitle').innerText = 'Add New Contact';
    document.getElementById('submitBtn').innerText = 'Save Contact';
    document.getElementById('cancelBtn').style.display = 'none';
}

function handleSearch() {
    const query = document.getElementById('searchInput').value;
    loadContacts(query);
}

// Allow pressing Enter in search input to trigger search
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
