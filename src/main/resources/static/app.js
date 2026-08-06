document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const searchInput = document.getElementById('searchInput');
    const contactIdInput = document.getElementById('contactId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Form fields
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const addressInput = document.getElementById('address');
    const categoryInput = document.getElementById('category');

    fetchContacts();

    contactForm.addEventListener('submit', saveContact);

    cancelBtn.addEventListener('click', resetForm);

    searchInput.addEventListener('keyup', debounce(() => {
        const query = searchInput.value;
        if (query) {
            fetchSearch(query);
        } else {
            fetchContacts();
        }
    }, 300));

    async function fetchContacts() {
        try {
            const response = await fetch('/api/contacts');
            const contacts = await response.json();
            renderContacts(contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    }

    async function fetchSearch(query) {
        try {
            const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`);
            const contacts = await response.json();
            renderContacts(contacts);
        } catch (error) {
            console.error('Error searching contacts:', error);
        }
    }

    function renderContacts(contacts) {
        contactList.innerHTML = '';
        contacts.forEach(contact => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.category}</td>
                <td>
                    <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            contactList.appendChild(tr);
        });
    }

    async function saveContact(event) {
        event.preventDefault();

        const contactData = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            phoneNumber: phoneNumberInput.value,
            address: addressInput.value,
            category: categoryInput.value
        };

        const id = contactIdInput.value;
        const url = id ? `/api/contacts/${id}` : '/api/contacts';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            if (response.ok) {
                resetForm();
                fetchContacts();
            } else {
                const errorData = await response.json();
                alert('Error saving contact: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('Error saving contact.');
        }
    }

    window.editContact = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`);
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
        } catch (error) {
            console.error('Error fetching contact for edit:', error);
        }
    };

    window.deleteContact = async (id) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchContacts();
            } else {
                alert('Error deleting contact.');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact.');
        }
    };

    function resetForm() {
        contactForm.reset();
        contactIdInput.value = '';
        submitBtn.textContent = 'Add Contact';
        cancelBtn.style.display = 'none';
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
