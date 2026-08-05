document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/api/contacts';
    const modal = document.getElementById('modal');
    const form = document.getElementById('contactForm');
    const contactListEl = document.getElementById('contactList');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalSpan = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');
    const contactIdInput = document.getElementById('contactId');
    const saveBtn = document.getElementById('saveBtn');
    const errorMessageEl = document.getElementById('errorMessage');

    // Load contacts on start and filter change
    fetchContacts();
    searchInput.addEventListener('input', fetchContacts);
    categoryFilter.addEventListener('change', fetchContacts);

    // Modal toggles
    openModalBtn.addEventListener('click', () => openModal());
    closeModalSpan.addEventListener('click', () => closeModal());
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = contactIdInput.value;
        const payload = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_BASE}/${id}` : API_BASE;
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.details ? Object.values(data.details).join(', ') : data.message);

            closeModal();
            fetchContacts();
        } catch (err) {
            errorMessageEl.textContent = err.message;
        }
    });

    async function fetchContacts() {
        const query = new URLSearchParams({
            search: searchInput.value.trim(),
            category: categoryFilter.value
        });
        try {
            const res = await fetch(`${API_BASE}?${query}`);
            const contacts = await res.json();
            renderContacts(contacts);
        } catch (err) {
            contactListEl.innerHTML = `<p style="color:red">Failed to load contacts.</p>`;
        }
    }

    function renderContacts(contacts) {
        contactListEl.innerHTML = '';
        if (contacts.length === 0) {
            contactListEl.innerHTML = '<p>No contacts found.</p>';
            return;
        }
        contacts.forEach(c => {
            const card = document.createElement('div');
            card.className = 'contact-card';
            card.innerHTML = `
                <h3>${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</h3>
                <p>📧 ${escapeHtml(c.email)}</p>
                <p>📞 ${escapeHtml(c.phoneNumber)}</p>
                ${c.address ? `<p>🏠 ${escapeHtml(c.address)}</p>` : ''}
                ${c.category ? `<p>🏷️ ${escapeHtml(c.category)}</p>` : ''}
                <div class="actions">
                    <button class="edit-btn" data-id="${c.id}">Edit</button>
                    <button class="delete-btn" data-id="${c.id}">Delete</button>
                </div>
            `;
            contactListEl.appendChild(card);
        });
        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.id)));
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => deleteContact(btn.dataset.id)));
    }

    function openModal(id = null) {
        modal.style.display = 'block';
        errorMessageEl.textContent = '';
        if (id) {
            modalTitle.textContent = 'Edit Contact';
            saveBtn.textContent = 'Update';
            fetch(`${API_BASE}/${id}`)
                .then(res => res.json())
                .then(c => {
                    contactIdInput.value = c.id;
                    document.getElementById('firstName').value = c.firstName;
                    document.getElementById('lastName').value = c.lastName;
                    document.getElementById('email').value = c.email;
                    document.getElementById('phoneNumber').value = c.phoneNumber;
                    document.getElementById('address').value = c.address || '';
                    document.getElementById('category').value = c.category || '';
                });
        } else {
            modalTitle.textContent = 'Add Contact';
            saveBtn.textContent = 'Save';
            form.reset();
            contactIdInput.value = '';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        form.reset();
        contactIdInput.value = '';
        errorMessageEl.textContent = '';
    }

    async function deleteContact(id) {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!res.ok && res.status !== 204) throw new Error('Delete failed');
            fetchContacts();
        } catch (err) {
            alert(err.message);
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
});
