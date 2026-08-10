document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const addContactBtn = document.getElementById('addContactBtn');
    const contactForm = document.getElementById('contactForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const contactsBody = document.getElementById('contactsBody');

    // Load all contacts on page load
    loadContacts();

    // Search button click handler
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            loadContacts(query);
        } else {
            loadContacts();
        }
    });

    // Add contact button click handler
    addContactBtn.addEventListener('click', function() {
        contactForm.style.display = 'flex';
        clearForm();
    });

    // Cancel form button click handler
    cancelFormBtn.addEventListener('click', function() {
        contactForm.style.display = 'none';
        clearForm();
    });

    // Form submit handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const contactId = document.getElementById('contactId').value;
        const contactData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        if (contactId) {
            // Update existing contact
            updateContact(contactId, contactData);
        } else {
            // Create new contact
            createContact(contactData);
        }
    });

    function loadContacts(query = '') {
        const url = query ? `/api/contacts/search?q=${encodeURIComponent(query)}` : '/api/contacts';
        
        fetch(url)
            .then(response => response.json())
            .then(contacts => {
                contactsBody.innerHTML = '';
                contacts.forEach(contact => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${contact.firstName}</td>
                        <td>${contact.lastName}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phoneNumber}</td>
                        <td>${contact.address}</td>
                        <td>${contact.category}</td>
                        <td class="action-buttons">
                            <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                        </td>
                    `;
                    contactsBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading contacts:', error));
    }

    function createContact(contactData) {
        fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        })
        .then(response => {
            if (response.ok) {
                contactForm.style.display = 'none';
                clearForm();
                loadContacts();
            } else {
                alert('Failed to create contact');
            }
        })
        .catch(error => console.error('Error creating contact:', error));
    }

    function updateContact(id, contactData) {
        fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        })
        .then(response => {
            if (response.ok) {
                contactForm.style.display = 'none';
                clearForm();
                loadContacts();
            } else {
                alert('Failed to update contact');
            }
        })
        .catch(error => console.error('Error updating contact:', error));
    }

    function deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    loadContacts();
                } else {
                    alert('Failed to delete contact');
                }
            })
            .catch(error => console.error('Error deleting contact:', error));
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
                contactForm.style.display = 'flex';
            })
            .catch(error => console.error('Error loading contact for editing:', error));
    }

    function clearForm() {
        document.getElementById('contactId').value = '';
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('address').value = '';
        document.getElementById('category').value = '';
    }
});
