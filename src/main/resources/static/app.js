document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const contactsBody = document.getElementById('contactsBody');
    
    let editingId = null;

    loadContacts();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        try {
            await saveContact(data);
            loadContacts();
            resetForm();
        } catch (error) {
            alert('Error saving contact: ' + error.message);
        }
    });

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            loadContacts(query);
            clearSearchBtn.style.display = 'inline-block';
        }
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        loadContacts();
    });

    document.getElementById('contactsTable').addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id);
            await editContact(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id);
            if (confirm('Are you sure you want to delete this contact?')) {
                await deleteContact(id);
                loadContacts();
            }
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', resetForm);

    async function loadContacts(query = '') {
        contactsBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
        try {
            const url = query ? `/api/contacts/search?q=${encodeURIComponent(query)}` : '/api/contacts';
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const contacts = await response.json();
            renderContacts(contacts);
        } catch (error) {
            console.error(error);
            contactsBody.innerHTML = '<tr><td colspan="5" style="color:red">Error loading contacts</td></tr>';
        }
    }

    function renderContacts(contacts) {
        if (contacts.length === 0) {
            contactsBody.innerHTML = '<tr><td colspan="5">No contacts found</td></tr>';
            return;
        }
        contactsBody.innerHTML = '';
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.category}</td>
                <td>
                    <button class="edit-btn" data-id="${contact.id}">Edit</button>
                    <button class="delete-btn" data-id="${contact.id}">Delete</button>
                </td>
            `;
            contactsBody.appendChild(row);
        });
    }

    function validateForm() {
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        return true;
    }

    async function saveContact(data) {
        const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';
        const method = editingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to save contact');
        }
    }

    async function editContact(id) {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            if (!response.ok) throw new Error('Failed to fetch contact');
            const contact = await response.json();
            
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address;
            document.getElementById('category').value = contact.category;
            
            editingId = id;
            document.getElementById('saveBtn').textContent = 'Update';
            window.scrollTo(0, 0);
        } catch (error) {
            alert(error.message);
        }
    }

    function resetForm() {
        form.reset();
        editingId = null;
        document.getElementById('contactId').value = '';
        document.getElementById('saveBtn').textContent = 'Save';
    }

    async function deleteContact(id) {
        try {
            const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete contact');
        } catch (error) {
            alert(error.message);
        }
    }
});
