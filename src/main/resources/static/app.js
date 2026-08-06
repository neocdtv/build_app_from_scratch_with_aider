const API_BASE = '/api/contacts';
const contactList = document.getElementById('contactList');
const formModal = document.getElementById('formModal');
const contactForm = document.getElementById('contactForm');
const searchInput = document.getElementById('searchInput');

async function fetchContacts(query = '') {
    const url = query ? `${API_BASE}/search?q=${encodeURIComponent(query)}` : API_BASE;
    const res = await fetch(url);
    return await res.json();
}

function renderContacts(contacts) {
    contactList.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName}</td><td>${c.lastName}</td><td>${c.email}</td>
            <td>${c.phoneNumber}</td><td>${c.address}</td><td>${c.category}</td>
            <td>
                <button class="edit-btn" onclick="editContact(${c.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        contactList.appendChild(tr);
    });
}

async function loadContacts() {
    try {
        const contacts = await fetchContacts(searchInput.value);
        renderContacts(contacts);
    } catch (e) { console.error(e); }
}

searchInput.addEventListener('input', loadContacts);

document.getElementById('addBtn').addEventListener('click', () => {
    contactForm.reset();
    document.getElementById('contactId').value = '';
    document.getElementById('formTitle').textContent = 'Add Contact';
    formModal.classList.remove('hidden');
});

document.getElementById('cancelBtn').addEventListener('click', () => formModal.classList.add('hidden'));

window.editContact = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`);
    const c = await res.json();
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    document.getElementById('formTitle').textContent = 'Edit Contact';
    formModal.classList.remove('hidden');
};

window.deleteContact = async (id) => {
    if (!confirm('Delete this contact?')) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    loadContacts();
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const body = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/${id}` : API_BASE;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    formModal.classList.add('hidden');
    loadContacts();
});

document.addEventListener('DOMContentLoaded', loadContacts);
