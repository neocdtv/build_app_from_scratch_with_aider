document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const contactIdInput = document.getElementById('contactId');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const addressInput = document.getElementById('address');
    const categoryInput = document.getElementById('category');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const contactsTableBody = document.getElementById('contactsTableBody');
    const searchInput = document.getElementById('searchInput');

    let isEditing = false;

    // Load contacts on page load
    loadContacts();

    // Form submission handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const contactData = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            address: addressInput.value.trim(),
            category: categoryInput.value.trim()
        };

        // Client-side validation
        if (!contactData.firstName || !contactData.lastName || !contactData.email) {
            alert('First name, last name, and email are required.');
            return;
        }

        if (isEditing) {
            try {
                const response = await fetch('/api/contacts/' + contactIdInput.value, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });

                if (response.ok) {
                    await loadContacts();
                    resetForm();
                } else {
                    alert('Failed to update contact.');
                }
            } catch (error) {
                console.error('Error updating contact:', error);
                alert('An error occurred while updating the contact.');
            }
        } else {
            try {
                const response = await fetch('/api/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                });

                if (response.ok) {
                    await loadContacts();
                    resetForm();
                } else {
                    alert('Failed to create contact.');
                }
            } catch (error) {
                console.error('Error creating contact:', error);
                alert('An error occurred while creating the contact.');
            }
        }
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', () => {
        resetForm();
    });

    // Load and display contacts
    async function loadContacts() {
        try {
            const response = await fetch('/api/contacts');
            const contacts = await response.json();
            displayContacts(contacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
            contactsTableBody.innerHTML = '<tr><td colspan="7">Failed to load contacts.</td></tr>';
        }
    }

    // Display contacts in table
    function displayContacts(contacts) {
        if (contacts.length === 0) {
            contactsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No contacts found.</td></tr>';
            return;
        }

        contactsTableBody.innerHTML = contacts.map(contact => `
            <tr>
                <td>${escapeHtml(contact.firstName)}</td>
                <td>${escapeHtml(contact.lastName)}</td>
                <td>${escapeHtml(contact.email)}</td>
                <td>${escapeHtml(contact.phoneNumber || '-')}</td>
                <td>${escapeHtml(contact.address || '-')}</td>
                <td>${escapeHtml(contact.category || '-')}</td>
                <td>
                    <button class="btn btn-edit btn-sm" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Edit contact
    window.editContact = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            if (!response.ok) {
                alert('Contact not found.');
                return;
            }

            const contact = await response.json();

            contactIdInput.value = contact.id;
            firstNameInput.value = contact.firstName;
            lastNameInput.value = contact.lastName;
            emailInput.value = contact.email;
            phoneNumberInput.value = contact.phoneNumber;
            addressInput.value = contact.address;
            categoryInput.value = contact.category;

            submitBtn.textContent = 'Update Contact';
            cancelBtn.style.display = 'inline-block';
            isEditing = true;
            contactForm.style.display = 'grid';
        } catch (error) {
            console.error('Error fetching contact:', error);
            alert('An error occurred while fetching the contact.');
        }
    };

    // Delete contact
    window.deleteContact = async (id) => {
        if (!confirm('Are you sure you want to delete this contact?')) {
            return;
        }

        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await loadContacts();
            } else {
                alert('Failed to delete contact.');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('An error occurred while deleting the contact.');
        }
    };

    // Reset form
    function resetForm() {
        contactForm.reset();
        contactIdInput.value = '';
        submitBtn.textContent = 'Add Contact';
        cancelBtn.style.display = 'none';
        isEditing = false;
    }

    // Live search handler
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            loadContacts();
            return;
        }

        try {
            const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`);
            const contacts = await response.json();
            displayContacts(contacts);
        } catch (error) {
            console.error('Error searching contacts:', error);
            contactsTableBody.innerHTML = '<tr><td colspan="7">Failed to search contacts.</td></tr>';
        }
    });

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
