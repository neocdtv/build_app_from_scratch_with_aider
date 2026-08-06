document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', saveContact);
});

function fetchContacts() {
    fetch('/api/contacts')
        .then(response => response.json())
        .then(contacts => {
            renderContacts(contacts);
        })
        .catch(error => console.error('Error fetching contacts:', error));
}

function searchContacts() {
    const query = document.getElementById('searchInput').value;
    fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(contacts => {
            renderContacts(contacts);
        })
        .catch(error => console.error('Error searching contacts:', error));
}

function renderContacts(contacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    contacts.forEach(contact => {
        const div = document.createElement('div');
        div.className = 'contact-card';
        div.innerHTML = `
            <div class="contact-info">
                <strong>${contact.firstName} ${contact.lastName}</strong><br>
                Email: ${contact.email}<br>
                Phone: ${contact.phoneNumber}<br>
                Address: ${contact.address}<br>
                Category: ${contact.category}
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        contactList.appendChild(div);
    });
}

function saveContact(event) {
    event.preventDefault();

    const id = document.getElementById('contactId').value;
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    if (id) {
        // Update
        fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(response => {
            if (response.ok) {
                clearForm();
                fetchContacts();
            } else {
                alert('Failed to update contact');
            }
        })
        .catch(error => console.error('Error updating contact:', error));
    } else {
        // Create
        fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
        .then(response => {
            if (response.ok) {
                clearForm();
                fetchContacts();
            } else {
                alert('Failed to create contact');
            }
        })
        .catch(error => console.error('Error creating contact:', error));
    }
}

function editContact(id) {
    fetch(`/api/contacts/${id}`)
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
            document.getElementById('cancelBtn').style.display = 'inline-block';
        })
        .catch(error => console.error('Error fetching contact details:', error));
}

function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        fetch(`/api/contacts/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchContacts();
            } else {
                alert('Failed to delete contact');
            }
        })
        .catch(error => console.error('Error deleting contact:', error));
    }
}

function clearForm() {
    document.getElementById('contactId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('address').value = '';
    document.getElementById('category').value = '';

    document.getElementById('formTitle').innerText = 'Add Contact';
    document.getElementById('cancelBtn').style.display = 'none';
}
