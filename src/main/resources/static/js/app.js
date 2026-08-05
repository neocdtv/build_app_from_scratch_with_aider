document.addEventListener('DOMContentLoaded', () => {
    const API = '/api/contacts';
    const list = document.getElementById('contactList');
    const modal = document.getElementById('modal');
    const form = document.getElementById('contactForm');
    const addBtn = document.getElementById('addContactBtn');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput');
    const fields = ['firstName','lastName','email','phoneNumber','address','category'];
    const hiddenId = document.getElementById('contactId');

    function render(data) {
        list.innerHTML = '';
        data.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${c.firstName}</td><td>${c.lastName}</td><td>${c.email}</td><td>${c.phoneNumber}</td><td>${c.category || '-'}</td><td><button onclick="editContact(${c.id})">Edit</button> <button onclick="deleteContact(${c.id})">Delete</button></td>`;
            list.appendChild(tr);
        });
    }

    async function fetchContacts() {
        const q = new URLSearchParams(searchInput.value ? { search: searchInput.value } : {});
        const res = await fetch(`${API}?${q.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        render(await res.json());
    }

    searchInput.addEventListener('input', fetchContacts);
    addBtn.onclick = () => { form.reset(); hiddenId.value = ''; document.getElementById('modalTitle').innerText = 'Add Contact'; modal.style.display = 'block'; };
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = hiddenId.value;
        const res = await fetch(`${API}/${id || ''}`, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(fields.map(f => [f, document.getElementById(f).value])))
        });
        if (!res.ok) { const err = await res.json(); alert(err.message || 'Validation error'); return; }
        modal.style.display = 'none'; fetchContacts();
    };

    window.editContact = (id) => {
        fetch(`${API}/${id}`).then(r => r.json()).then(c => {
            hiddenId.value = c.id; fields.forEach(f => document.getElementById(f).value = c[f] || '');
            document.getElementById('modalTitle').innerText = 'Edit Contact'; modal.style.display = 'block';
        });
    };

    window.deleteContact = async (id) => {
        if (!confirm('Delete this contact?')) return;
        if ((await fetch(`${API}/${id}`, { method: 'DELETE' })).ok) fetchContacts();
    };

    fetchContacts();
});
