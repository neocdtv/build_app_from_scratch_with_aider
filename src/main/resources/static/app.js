document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const contactsBody = document.getElementById('contactsBody');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    loadContacts();

    form.addEventListener('submit', saveContact);
    searchBtn.addEventListener('click', searchContacts);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        loadContacts();
    });
    cancelBtn.addEventListener('click', resetForm);

    async function loadContacts() {
        try {
            const res = await fetch('/api/contacts');
            const contacts = await res.json();
            renderContacts(contacts);
        } catch (err) { console.error('Error loading contacts:', err); }
    }

    async function searchContacts() {
        const query = searchInput.value.trim();
        if (!query) return;
        try {
            const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`);
            const contacts = await res.json();
            renderContacts(contacts);
            clearSearchBtn.style.display = 'inline-block';
        } catch (err) { console.error('Error searching:', err); }
    }

    function renderContacts(contacts) {
        contactsBody.innerHTML = '';
        if (contacts.length === 0) {
            contactsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No contacts found.</td></tr>';
            return;
        }
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.address}</td>
                <td>${contact.category}</td>
                <td>
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Delete</button>
                </td>
            `;
            row.querySelector('.edit-btn').addEventListener('click', () => editContact(contact));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteContact(contact.id));
            contactsBody.appendChild(row);
        });
    }

    function validateForm() {
        const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'category'];
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        fields.forEach(field => {
            const input = document.getElementById(field);
            const errorSpan = input.nextElementSibling;
            if (!input.value.trim()) {
                showError(input, errorSpan, 'This field is required');
                isValid = false;
            } else if (field === 'email' && !emailRegex.test(input.value)) {
                showError(input, errorSpan, 'Invalid email format');
                isValid = false;
            } else {
                clearError(input, errorSpan);
            }
        });
        return isValid;
    }

    function showError(input, span, msg) {
        input.style.borderColor = 'var(--error-color)';
        span.textContent = msg;
    }

    function clearError(input, span) {
        input.style.borderColor = 'var(--border-color)';
        span.textContent = '';
    }

    async function saveContact(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const contactData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        const id = document.getElementById('contactId').value;
        const url = id ? `/api/contacts/${id}` : '/api/contacts';
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            
            if (res.ok || res.status === 201) {
                resetForm();
                loadContacts();
            } else {
                alert('Failed to save contact.');
            }
        } catch (err) { console.error('Error saving contact:', err); }
    }

    function editContact(contact) {
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        
        submitBtn.textContent = 'Update Contact';
        cancelBtn.style.display = 'inline-block';
        window.scrollTo(0, 0);
    }

    async function deleteContact(id) {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            if (res.ok) loadContacts();
        } catch (err) { console.error('Error deleting contact:', err); }
    }

    function resetForm() {
        form.reset();
        document.getElementById('contactId').value = '';
        submitBtn.textContent = 'Add Contact';
        cancelBtn.style.display = 'none';
        ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'category'].forEach(field => {
            clearError(document.getElementById(field), document.getElementById(field).nextElementSibling);
        });
    }
});
