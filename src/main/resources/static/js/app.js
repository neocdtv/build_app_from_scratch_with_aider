document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const form = document.getElementById('contactForm');
    const tbody = document.querySelector('#contactsTable tbody');
    const searchInput = document.getElementById('searchInput');
    let editId = null;

    // Fetch & Render Contacts
    async function fetchContacts(search = '', category = '') {
        let url = '/api/contacts?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        url += `category=${encodeURIComponent(category)}`;
        
        try {
            const res = await fetch(url);
            const contacts = await res.json();
            tbody.innerHTML = '';
            contacts.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${c.firstName}</td><td>${c.lastName}</td>
                    <td>${c.email}</td><td>${c.phoneNumber}</td>
                    <td>${c.category || '-'}</td>
                    <td class="actions">
                        <button onclick="editContact(${c.id})">Edit</button>
                        <button onclick="deleteContact(${c.id})">Delete</button>
                    </td>`;
                tbody.appendChild(tr);
            });
        } catch (err) { console.error('Fetch error:', err); }
    }

    // Search/Clear
    document.getElementById('searchBtn').onclick = () => fetchContacts(searchInput.value);
    document.getElementById('clearBtn').onclick = () => { searchInput.value = ''; fetchContacts(); };
    document.getElementById('addBtn').onclick = () => openModal(null);
    modal.querySelector('.close').onclick = () => closeModal();

    // Modal Logic
    function openModal(id) {
        editId = id;
        document.getElementById('modalTitle').textContent = id ? 'Edit Contact' : 'Add Contact';
        form.reset();
        document.getElementById('contactId').value = id || '';
        modal.style.display = 'block';
    }
    function closeModal() { modal.style.display = 'none'; editId = null; }

    // Form Submit (Create/Update)
    form.onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());
        const method = editId ? 'PUT' : 'POST';
        const url = editId ? `/api/contacts/${editId}` : '/api/contacts';

        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Validation failed');
            closeModal();
            fetchContacts(searchInput.value);
        } catch (err) {
            // Parse structured error for validation messages
            const errData = await res.json().catch(() => ({}));
            document.getElementById('formErrors').textContent = errData.message || 'An error occurred';
        }
    };

    // Edit/Delete Actions
    window.editContact = (id) => fetch(`/api/contacts/${id}`).then(r => r.json()).then(c => {
        form.firstName.value = c.firstName; form.lastName.value = c.lastName;
        form.email.value = c.email; form.phoneNumber.value = c.phoneNumber;
        form.address.value = c.address || ''; form.category.value = c.category || '';
        openModal(id);
    });
    window.deleteContact = (id) => { if(confirm('Delete this contact?')) fetch(`/api/contacts/${id}`, { method: 'DELETE' }).then(() => fetchContacts(searchInput.value)); };

    // Initial Load
    fetchContacts();
});
