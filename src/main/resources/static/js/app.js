document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/contacts';
    let contacts = [];
    
    // DOM elements
    const contactTableBody = document.getElementById('contactTableBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchBtn = document.getElementById('searchBtn');
    const addContactBtn = document.getElementById('addContactBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const contactForm = document.getElementById('contactForm');
    const modalTitle = document.getElementById('modalTitle');
    const errorMessage = document.getElementById('errorMessage');

    // Fetch contacts on page load
    fetchContacts();

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const search = searchInput.value.trim();
        const category = categoryFilter.value;
        fetchContacts(search, category);
    });

    addContactBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => closeModalHandler());
    cancelBtn.addEventListener('click', () => closeModalHandler());
    contactForm.addEventListener('submit', handleSubmit);

    async function fetchContacts(search = '', category = '') {
        try {
            let url = apiUrl;
            const params = [];
            if (search) params.push(`search=${encodeURIComponent(search)}`);
            if (category) params.push(`category=${encodeURIComponent(category)}`);
            if (params.length > 0) url += '?' + params.join('&');

            const response = await fetch(url);
            contacts = await response.json();
            renderContacts();
        } catch (error) {
            showError('Failed to load contacts: ' + error.message);
        }
    }

    function renderContacts() {
        if (contacts.length === 0) {
            contactTableBody.innerHTML = '<tr><td colspan="6" class="empty-message">No contacts found</td></tr>';
            return;
        }

        contactTableBody.innerHTML = contacts.map(contact => `
            <tr>
                <td>${escapeHtml(contact.firstName)}</td>
                <td>${escapeHtml(contact.lastName)}</td>
                <td>${escapeHtml(contact.email)}</td>
                <td>${escapeHtml(contact.phoneNumber)}</td>
                <td>${escapeHtml(contact.category || '-')}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    function openModal(contact = null) {
        if (contact) {
            modalTitle.textContent = 'Edit Contact';
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address || '';
            document.getElementById('category').value = contact.category || '';
        } else {
            modalTitle.textContent = 'Add Contact';
            contactForm.reset();
            document.getElementById('contactId').value = '';
        }
        modal.classList.add('show');
    }

    function closeModalHandler() {
        modal.classList.remove('show');
        hideError();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const contactId = document.getElementById('contactId').value;
        const data = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            address: document.getElementById('address').value.trim(),
            category: document.getElementById('category').value
        };

        try {
            let response;
            if (contactId) {
                response = await fetch(`${apiUrl}/${contactId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
            } else {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
            }

            if (response.ok) {
                closeModalHandler();
                fetchContacts();
            } else {
                const error = await response.json();
                showError(error.message || 'Failed to save contact');
            }
        } catch (error) {
            showError('Failed to save contact: ' + error.message);
        }
    }

    async function deleteContact(id) {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchContacts();
            } else {
                showError('Failed to delete contact');
            }
        } catch (error) {
            showError('Failed to delete contact: ' + error.message);
        }
    }

    window.editContact = async function(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (response.ok) {
                const contact = await response.json();
                openModal(contact);
            } else {
                showError('Failed to load contact');
            }
        } catch (error) {
            showError('Failed to load contact: ' + error.message);
        }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    function hideError() {
        errorMessage.classList.remove('show');
    }
});
