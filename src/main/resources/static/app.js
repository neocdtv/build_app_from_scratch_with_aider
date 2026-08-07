document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/contacts';
    const tableBody = document.querySelector('#contactTable tbody');
    const searchInput = document.getElementById('searchInput');
    const addBtn = document.getElementById('addBtn');
    const formModal = document.getElementById('formModal');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const fields = ['firstName','lastName','email','phoneNumber','address','category'].map(id => document.getElementById(id));

    function renderContacts(contacts) {
        tableBody.innerHTML = '';
        if (!contacts.length) {
            tableBody.innerHTML = '<tr><td colspan="5">No contacts found.</td></tr>';
            return;
        }
        contacts.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.firstName} ${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.category}</td>
                <td>
                    <button class="edit-btn" onclick="editContact(${c.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
                </td>`;
            tableBody.appendChild(tr);
        });
    }

    async function fetchContacts(q = '') {
        try {
            const res = await fetch(`${apiUrl}/search?q=${encodeURIComponent(q)}`);
            renderContacts(await res.json());
        } catch (err) { console.error('Fetch error:', err); }
    }

    searchInput.addEventListener('input', e => fetchContacts(e.target.value));
    addBtn.addEventListener('click', () => {
        document.getElementById('formTitle').textContent = 'Add Contact';
        contactForm.reset(); document.getElementById('contactId').value = '';
        formModal.classList.remove('hidden');
    });
    cancelBtn.addEventListener('click', () => formModal.classList.add('hidden'));

    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const payload = Object.fromEntries(fields.map(f => [f.id, f.value]));
        
        // Client-side validation before API call
        for (const f of fields) if (!f.checkValidity()) return;

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${apiUrl}/${id}` : apiUrl;
            const res = await fetch(url, {
                method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to save');
            formModal.classList.add('hidden');
            fetchContacts(searchInput.value);
        } catch (err) { alert(err.message); }
    });

    window.editContact = async id => {
        try {
            const res = await fetch(`${apiUrl}/${id}`);
            const c = await res.json();
            fields.forEach(f => f.value = c[f.id] || '');
            document.getElementById('contactId').value = c.id;
            document.getElementById('formTitle').textContent = 'Edit Contact';
            formModal.classList.remove('hidden');
        } catch (err) { alert('Failed to load contact'); }
    };

    window.deleteContact = async id => {
        if (!confirm('Delete this contact?')) return;
        try {
            const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            fetchContacts(searchInput.value);
        } catch (err) { alert(err.message); }
    };

    fetchContacts();
});
