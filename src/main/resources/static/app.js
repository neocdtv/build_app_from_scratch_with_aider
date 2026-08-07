const API_URL = '/api/contacts';

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

async function loadContacts(query = '') {
    const list = document.getElementById('contactList');
    list.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    let url = API_URL;
    if (query) {
        url += `/search?q=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        const contacts = await response.json();
        
        list.innerHTML = '';
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.address}</td>
                <td>${contact.category}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            list.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
        list.innerHTML = '<tr><td colspan="6">Failed to load contacts</td></tr>';
    }
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('contactId').value;
    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        let url = API_URL;
        let method = 'POST';

        if (id) {
            url += `/${id}`;
            contactData.id = parseInt(id);
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (response.ok || response.status === 201) {
            clearForm();
            loadContacts();
        } else {
            const error = await response.json();
            alert('Error saving contact: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save contact');
    }
});

async function searchContacts() {
    const query = document.getElementById('searchInput').value;
    loadContacts(query);
}

async function editContact(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const contact = await response.json();
        
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        
        document.getElementById('formTitle').textContent = 'Edit Contact';
        document.getElementById('submitBtn').textContent = 'Update Contact';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    } catch (error) {
        console.error('Error loading contact for editing:', error);
    }
}

function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                loadContacts();
            } else {
                alert('Failed to delete contact');
            }
        })
        .catch(error => console.error('Error:', error));
}

function clearForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('formTitle').textContent = 'Add Contact';
    document.getElementById('submitBtn').textContent = 'Add Contact';
    document.getElementById('cancelBtn').style.display = 'none';
}
