document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const searchInput = document.getElementById('searchInput');
    const contactTableBody = document.getElementById('contactTableBody');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');

    let editingId = null;

    // Load contacts on startup
    loadContacts();

    // Search functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetch(`/api/contacts/search?query=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(contacts => renderContacts(contacts))
                .catch(err => console.error('Search error:', err));
        } else {
            loadContacts();
        }
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const contact = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            address: document.getElementById('address').value.trim(),
            category: document.getElementById('category').value.trim()
        };

        if (editingId) {
            // Update existing contact
            fetch(`/api/contacts/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            })
            .then(res => {
                if (res.ok) {
                    loadContacts();
                    resetForm();
                } else {
                    alert('Failed to update contact');
                }
            })
            .catch(err => console.error('Update error:', err));
        } else {
            // Create new contact
            fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            })
            .then(res => {
                if (res.ok) {
                    loadContacts();
                    resetForm();
                } else {
                    alert('Failed to create contact');
                }
            })
            .catch(err => console.error('Create error:', err));
        }
    });

    // Cancel button
    cancelBtn.addEventListener('click', resetForm);

    // Helper functions
    function loadContacts() {
        fetch('/api/contacts')
            .then(res => res.json())
            .then(contacts => renderContacts(contacts))
            .catch(err => console.error('Load error:', err));
    }

    function renderContacts(contacts) {
        contactTableBody.innerHTML = '';
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${contact.firstName} ${contact.lastName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${contact.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${contact.phoneNumber || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${contact.category || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="editContact(${contact.id})" class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                    <button onclick="deleteContact(${contact.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            `;
            contactTableBody.appendChild(row);
        });
    }

    window.editContact = function(id) {
        fetch(`/api/contacts/${id}`)
            .then(res => res.json())
            .then(contact => {
                document.getElementById('contactId').value = contact.id;
                document.getElementById('firstName').value = contact.firstName;
                document.getElementById('lastName').value = contact.lastName;
                document.getElementById('email').value = contact.email;
                document.getElementById('phoneNumber').value = contact.phoneNumber || '';
                document.getElementById('address').value = contact.address || '';
                document.getElementById('category').value = contact.category || '';
                editingId = contact.id;
                formTitle.textContent = 'Edit Contact';
            })
            .catch(err => console.error('Load contact error:', err));
    };

    window.deleteContact = function(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            fetch(`/api/contacts/${id}`, { method: 'DELETE' })
                .then(res => {
                    if (res.ok) {
                        loadContacts();
                    } else {
                        alert('Failed to delete contact');
                    }
                })
                .catch(err => console.error('Delete error:', err));
        }
    };

    function resetForm() {
        contactForm.reset();
        document.getElementById('contactId').value = '';
        editingId = null;
        formTitle.textContent = 'Add New Contact';
    }
});
