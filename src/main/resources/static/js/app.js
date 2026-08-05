document.addEventListener('DOMContentLoaded', () => {
    const contactList = document.getElementById('contactList');
    const modal = document.getElementById('modal');
    const addContactBtn = document.getElementById('addContactBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('contactForm');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    addContactBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', () => closeModal());
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
    form.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', loadContacts);
    categoryFilter.addEventListener('change', loadContacts);

    async function loadContacts() {
        const search = searchInput.value.trim();
        const category = categoryFilter.value;
        let url = `/api/contacts?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
        
        try {
            const res = await fetch(url);
            const contacts = await res.json();
            contactList.innerHTML = '';
            contacts.forEach(c => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${c.firstName} ${c.lastName}</td>
                    <td>${c.email}</td>
                    <td>${c.phoneNumber}</td>
                    <td>${c.category}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${c.id}">Edit</button>
                        <button class="delete-btn" data-id="${c.id}">Delete</button>
                    </td>
                `;
                contactList.appendChild(row);
            });
        } catch (err) {
            console.error('Failed to load contacts', err);
        }
    }

    function openModal(contact = null) {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = contact ? 'Edit Contact' : 'Add Contact';
        form.reset();
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.getElementById('contactId').value = contact ? contact.id : '';
        if (contact) {
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address || '';
            document.getElementById('category').value = contact.category || '';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function validateForm() {
        let isValid = true;
        document.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('input');
            const errorSpan = group.querySelector('.error');
            errorSpan.textContent = '';
            if (!input.checkValidity()) {
                errorSpan.textContent = input.validationMessage;
                isValid = false;
            }
        });
        return isValid;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const id = document.getElementById('contactId').value;
        const dto = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value || null,
            category: document.getElementById('category').value || null
        };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/contacts/${id}` : '/api/contacts';
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });
            closeModal();
            loadContacts();
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save contact');
        }
    }

    contactList.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            try {
                const res = await fetch(`/api/contacts/${id}`);
                const contact = await res.json();
                openModal(contact);
            } catch (err) {
                console.error('Failed to fetch contact', err);
            }
        } else if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            if (confirm('Are you sure you want to delete this contact?')) {
                try {
                    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
                    loadContacts();
                } catch (err) {
                    console.error('Delete failed', err);
                }
            }
        }
    });

    loadContacts();
});
