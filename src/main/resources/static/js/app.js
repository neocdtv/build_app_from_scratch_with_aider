document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const addressInput = document.getElementById('address');
    const categoryInput = document.getElementById('category');
    const contactIdInput = document.getElementById('contactId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    let currentSearchQuery = '';

    // Load contacts on page load
    loadContacts();

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const contact = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            phoneNumber: phoneNumberInput.value.trim(),
            address: addressInput.value.trim(),
            category: categoryInput.value.trim()
        };

        // Client-side validation
        if (!validateContact(contact)) {
            return;
        }

        const contactId = contactIdInput.value;
        let response;

        if (contactId) {
            // Update existing contact
            response = await fetch(`/api/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });
        } else {
            // Create new contact
            response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });
        }

        if (response.ok) {
            // Reset form and reload contacts
            contactForm.reset();
            contactIdInput.value = '';
            cancelBtn.style.display = 'none';
            submitBtn.textContent = 'Add Contact';
            loadContacts();
        } else {
            alert('Failed to save contact. Please try again.');
        }
    });

    // Handle cancel button
    cancelBtn.addEventListener('click', function() {
        contactForm.reset();
        contactIdInput.value = '';
        cancelBtn.style.display = 'none';
        submitBtn.textContent = 'Add Contact';
        loadContacts();
    });

    // Handle search
    searchButton.addEventListener('click', function() {
        handleSearch();
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const query = searchInput.value.trim();
        currentSearchQuery = query;

        if (query) {
            fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(contacts => {
                    displayContacts(contacts);
                })
                .catch(error => {
                    console.error('Search error:', error);
                    contactsList.innerHTML = '<div class="no-results">Error loading contacts</div>';
                });
        } else {
            loadContacts();
        }
    }

    // Load all contacts
    function loadContacts() {
        fetch('/api/contacts')
            .then(response => response.json())
            .then(contacts => {
                displayContacts(contacts);
            })
            .catch(error => {
                console.error('Load contacts error:', error);
                contactsList.innerHTML = '<div class="no-results">Error loading contacts</div>';
            });
    }

    // Display contacts in the list
    function displayContacts(contacts) {
        if (contacts.length === 0) {
            contactsList.innerHTML = '<div class="no-results">No contacts found</div>';
            return;
        }

        contactsList.innerHTML = contacts.map(contact => createContactHTML(contact)).join('');
    }

    // Create HTML for a single contact
    function createContactHTML(contact) {
        const name = `${contact.firstName} ${contact.lastName}`;
        const details = [
            `📧 ${contact.email}`,
            `📱 ${contact.phoneNumber}`,
            `📍 ${contact.address}`,
            `🏷️ ${contact.category}`
        ].join('<br>');

        return `
            <div class="contact-item" data-id="${contact.id}">
                <div class="contact-info">
                    <div class="contact-name">${name}</div>
                    <div class="contact-details">${details}</div>
                </div>
                <div class="contact-actions">
                    <button class="btn btn-small btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
        `;
    }

    // Edit contact
    window.editContact = function(id) {
        fetch(`/api/contacts/${id}`)
            .then(response => response.json())
            .then(contact => {
                // Populate form
                firstNameInput.value = contact.firstName;
                lastNameInput.value = contact.lastName;
                emailInput.value = contact.email;
                phoneNumberInput.value = contact.phoneNumber;
                addressInput.value = contact.address;
                categoryInput.value = contact.category;
                
                // Set form mode to edit
                contactIdInput.value = contact.id;
                submitBtn.textContent = 'Update Contact';
                cancelBtn.style.display = 'block';
                
                // Scroll to form
                document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Load contact error:', error);
                alert('Failed to load contact for editing');
            });
    };

    // Delete contact
    window.deleteContact = function(id) {
        if (!confirm('Are you sure you want to delete this contact?')) {
            return;
        }

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
        .catch(error => {
            console.error('Delete contact error:', error);
            alert('An error occurred while deleting the contact');
        });
    };

    // Validate contact data
    function validateContact(contact) {
        const errors = [];

        if (!contact.firstName || contact.firstName.trim() === '') {
            errors.push('First name is required');
        }
        if (!contact.lastName || contact.lastName.trim() === '') {
            errors.push('Last name is required');
        }
        if (!contact.email || contact.email.trim() === '') {
            errors.push('Email is required');
        } else if (!isValidEmail(contact.email)) {
            errors.push('Invalid email format');
        }
        if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
            errors.push('Phone number is required');
        }
        if (!contact.address || contact.address.trim() === '') {
            errors.push('Address is required');
        }
        if (!contact.category || contact.category.trim() === '') {
            errors.push('Category is required');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }

        return true;
    }

    // Email validation regex
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
