document.addEventListener('DOMContentLoaded', () => {
    const contactsTableBody = document.getElementById('contactsBody');
    const addContactButton = document.getElementById('addContactButton');
    const contactFormModal = document.getElementById('contactFormModal');
    const closeModal = contactFormModal.querySelector('.close');
    const contactForm = document.getElementById('contactForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    async function loadContacts(searchQuery = '') {
        try {
            const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(searchQuery)}`);
            const contacts = await response.json();
            contactsTableBody.innerHTML = '';
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.firstName}</td><td>${contact.lastName}</td><td>${contact.email}</td>
                    <td>${contact.phoneNumber}</td><td>${contact.address}</td><td>${contact.category}</td>
                    <td>
                        <button onclick="editContact(${contact.id})">Edit</button>
                        <button onclick="deleteContact(${contact.id})">Delete</button>
                    </td>
                `;
                contactsTableBody.appendChild(row);
            });
        } catch (error) { console.error('Error loading contacts:', error); }
    }

    function openModal(isEdit = false) {
        contactFormModal.style.display = 'block';
        if (!isEdit) {
            contactForm.reset();
            document.getElementById('contactId').value = '';
            document.getElementById('modalTitle').textContent = 'Add Contact';
        }
    }

    function closeModalWindow() { contactFormModal.style.display = 'none'; }

    addContactButton.addEventListener('click', () => openModal(false));
    closeModal.addEventListener('click', closeModalWindow);
    window.addEventListener('click', (event) => { if (event.target === contactFormModal) closeModalWindow(); });

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const contactId = document.getElementById('contactId').value;
        const contactData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };
        try {
            const url = contactId ? `/api/contacts/${contactId}` : '/api/contacts';
            const method = contactId ? 'PUT' : 'POST';
            await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactData) });
            closeModalWindow();
            loadContacts(searchInput.value);
        } catch (error) { console.error('Error saving contact:', error); }
    });

    window.editContact = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            const contact = await response.json();
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address;
            document.getElementById('category').value = contact.category;
            document.getElementById('modalTitle').textContent = 'Edit Contact';
            openModal(true);
        } catch (error) { console.error('Error loading contact for edit:', error); }
    };

    window.deleteContact = async (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
                loadContacts(searchInput.value);
            } catch (error) { console.error('Error deleting contact:', error); }
        }
    };

    searchButton.addEventListener('click', () => loadContacts(searchInput.value));
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadContacts(searchInput.value); });
    loadContacts();
});
