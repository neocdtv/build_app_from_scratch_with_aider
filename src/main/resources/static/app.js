const API_URL = '/api/contacts';

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
});

function loadContacts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('contactsList');
            tbody.innerHTML = '';
            data.forEach(contact => {
                const row = `
                    <tr>
                        <td>${contact.id}</td>
                        <td>${contact.firstName} ${contact.lastName}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phoneNumber}</td>
                        <td>${contact.category}</td>
                        <td>
                            <button onclick='editContact(${JSON.stringify(contact)})'>Edit</button>
                            <button onclick="deleteContact(${contact.id})" style="background-color: #dc3545;">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
}

function openAddModal() {
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
    document.getElementById('modalTitle').innerText = 'Add Contact';
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
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
    document.getElementById('contactModal').style.display = 'block';
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('contactId').value;
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    })
    .then(res => {
        if (res.ok) {
            closeModal();
            loadContacts();
        } else {
            alert('Error saving contact');
        }
    });
}

function deleteContact(id) {
    if(confirm('Are you sure?')) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(() => loadContacts());
    }
}

function handleSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.length === 0) {
        loadContacts();
        return;
    }
    fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('contactsList');
            tbody.innerHTML = '';
            data.forEach(contact => {
                const row = `
                    <tr>
                        <td>${contact.id}</td>
                        <td>${contact.firstName} ${contact.lastName}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phoneNumber}</td>
                        <td>${contact.category}</td>
                        <td>
                            <button onclick='editContact(${JSON.stringify(contact)})'>Edit</button>
                            <button onclick="deleteContact(${contact.id})" style="background-color: #dc3545;">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
}
