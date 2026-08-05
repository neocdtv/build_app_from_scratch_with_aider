document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const contactForm = document.getElementById('contactForm');
    const addBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const filterBtn = document.getElementById('filterBtn');
    const contactList = document.getElementById('contactList');
    const submitBtn = document.getElementById('submitBtn');

    let editId = null;
    let contacts = [];

    // Open modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Add Contact';
        contactForm.reset();
        editId = null;
        clearErrors();
    });

    // Close modal
    [cancelBtn, closeBtn].forEach(btn => {
        btn.addEventListener('click', () => modal.style.display = 'none');
    });

    // Submit form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            address: document.getElementById('address').value.trim(),
            category: document.getElementById('category').value || null
        };

        try {
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `/api/contacts/${editId}` : '/api/contacts';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            closeModal();
            fetchContacts();
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        }
    });

    // Filter
    filterBtn.addEventListener('click', fetchContacts);
    searchInput.addEventListener('input', fetchContacts);

    // Fetch & display contacts
    async function fetchContacts() {
        const search = searchInput.value.trim();
        const category = categoryFilter.value || null;
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        try {
            const response = await fetch(`/api/contacts?${params.toString()}`);
            contacts = await response.json();
            renderContacts();
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
            alert('Failed to load contacts.');
        }
    }

    // Render contacts
    function renderContacts() {
        contactList.innerHTML = '';
        contacts.forEach(contact => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</td>
                <td>${escapeHtml(contact.email)}</td>
                <td>${escapeHtml(contact.phoneNumber)}</td>
                <td>${escapeHtml(contact.category || '')}</td>
                <td class="actions">
                    <button class="edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            contactList.appendChild(tr);
        });
    }

    // Edit contact
    window.editContact = async function(id) {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            const contact = await response.json();

            editId = contact.id;
            document.getElementById('modalTitle').textContent = 'Edit Contact';
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address || '';
            document.getElementById('category').value = contact.category || '';

            modal.style.display = 'block';
            clearErrors();
        } catch (err) {
            console.error(err);
            alert('Failed to load contact details.');
        }
    };

    // Delete contact
    window.deleteContact = async function(id) {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        try {
            await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            fetchContacts();
        } catch (err) {
            console.error(err);
            alert('Failed to delete contact.');
        }
    };

    // Modal closing helper
    function closeModal() {
        modal.style.display = 'none';
        editId = null;
        contactForm.reset();
    }

    // Validation
    function validateForm() {
        clearErrors();
        let valid = true;
        const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'category'];
        const patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^\+?[1-9]\d{1,14}$/
        };

        fields.forEach(field => {
            const el = document.getElementById(field);
            const val = el.value.trim();
            const errorEl = document.getElementById(`${field}Error`);

            if (field === 'firstName' || field === 'lastName' || field === 'email' || field === 'phoneNumber') {
                if (!val) {
                    el.classList.add('error');
                    errorEl.textContent = 'This field is required.';
                    valid = false;
                } else if (field === 'email' && !patterns.email.test(val)) {
                    el.classList.add('error');
                    errorEl.textContent = 'Invalid email format.';
                    valid = false;
                } else if (field === 'phoneNumber' && !patterns.phone.test(val)) {
                    el.classList.add('error');
                    errorEl.textContent = 'Phone must be in E.164 format (e.g., +1234567890).';
                    valid = false;
                }
            }
        });

        return valid;
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Initial fetch
    fetchContacts();
});
