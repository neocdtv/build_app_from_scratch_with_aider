document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    const addBtn = document.getElementById('addBtn');
    const closeBtn = document.querySelector('.close');
    const contactForm = document.getElementById('contactForm');
    const contactTableBody = document.querySelector('#contactTable tbody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    let contacts = [];
    let editingId = null;

    // Load initial data
    fetchContacts();

    // Event listeners
    addBtn.addEventListener('click', () => openModal(false));
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    contactForm.addEventListener('submit', handleFormSubmit);

    searchInput.addEventListener('input', () => renderTable());
    categoryFilter.addEventListener('change', () => renderTable());

    // Functions
    async function fetchContacts(search = '', category = '') {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        const response = await fetch(`/api/contacts?${params.toString()}`);
        contacts = await response.json();
        renderTable();
    }

    function renderTable() {
        const search = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const filtered = contacts.filter(c =>
            (c.firstName?.toLowerCase().includes(search) ||
             c.lastName?.toLowerCase().includes(search) ||
             (c.category?.toLowerCase().includes(search))) &&
            (!category || c.category === category)
        );

        contactTableBody.innerHTML = '';
        filtered.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.category || ''}</td>
                <td>
                    <button onclick="editContact(${contact.id})">Edit</button>
                    <button onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            contactTableBody.appendChild(row);
        });
    }

    window.editContact = async function(id) {
        const response = await fetch(`/api/contacts/${id}`);
        const contact = await response.json();
        openModal(true, contact);
    };

    window.deleteContact = async function(id) {
        if (confirm('Are you sure?')) {
            await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            fetchContacts(searchInput.value, categoryFilter.value);
        }
    };

    function openModal(isEdit, contact = null) {
        modal.style.display = 'block';
        editingId = isEdit ? contact.id : null;
        document.getElementById('modalTitle').textContent = isEdit ? 'Edit Contact' : 'Add Contact';
        document.getElementById('contactId').value = isEdit ? contact.id : '';
        document.getElementById('firstName').value = isEdit ? contact.firstName : '';
        document.getElementById('lastName').value = isEdit ? contact.lastName : '';
        document.getElementById('email').value = isEdit ? contact.email : '';
        document.getElementById('phoneNumber').value = isEdit ? contact.phoneNumber : '';
        document.getElementById('address').value = isEdit ? contact.address : '';
        document.getElementById('category').value = isEdit ? contact.category : '';
    }

    function closeModal() {
        modal.style.display = 'none';
        contactForm.reset();
        editingId = null;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        try {
            if (editingId) {
                await fetch(`/api/contacts/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch('/api/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }
            fetchContacts(searchInput.value, categoryFilter.value);
            closeModal();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
});
