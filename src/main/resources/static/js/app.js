const API_BASE = '/api/contacts';
const searchInput = document.getElementById('searchInput');
const contactsBody = document.getElementById('contactsBody');
const formSection = document.getElementById('formSection');
const contactForm = document.getElementById('contactForm');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');
const addBtn = document.getElementById('addBtn');

let editingId = null;

document.addEventListener('DOMContentLoaded', () => loadContacts());

searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    loadContacts(q ? `?q=${encodeURIComponent(q)}` : '');
});

async function loadContacts(query = '') {
    const url = query ? `${API_BASE}/search${query}` : API_BASE;
    const res = await fetch(url);
    const contacts = await res.json();
    contactsBody.innerHTML = contacts.map(c => `
        <tr>
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.category}</td>
            <td>
                <button class="edit-btn" onclick="editContact(${c.id}, '${c.firstName}', '${c.lastName}', '${c.email}', '${c.phoneNumber}', '${c.address}', '${c.category}')">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

addBtn.addEventListener('click', () => {
    editingId = null;
    contactForm.reset();
    formTitle.textContent = 'Add Contact';
    formSection.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    formSection.classList.add('hidden');
    contactForm.reset();
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        id: editingId,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    try {
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.status === 204) {
            cancelBtn.click();
            loadContacts(searchInput.value);
        } else if (res.ok) {
            cancelBtn.click();
            loadContacts(searchInput.value);
        }
    } catch (err) { console.error(err); }
});

window.editContact = (id, fn, ln, em, ph, addr, cat) => {
    editingId = id;
    document.getElementById('firstName').value = fn;
    document.getElementById('lastName').value = ln;
    document.getElementById('email').value = em;
    document.getElementById('phoneNumber').value = ph;
    document.getElementById('address').value = addr;
    document.getElementById('category').value = cat;
    formTitle.textContent = 'Edit Contact';
    formSection.classList.remove('hidden');
};

window.deleteContact = async (id) => {
    if (!confirm('Delete this contact?')) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    loadContacts(searchInput.value);
};
