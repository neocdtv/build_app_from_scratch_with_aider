const API = '/api/contacts';
const tableBody = document.querySelector('#contactTable tbody');
const modal = document.getElementById('modal');
const form = document.getElementById('contactForm');
const searchInput = document.getElementById('searchInput');

async function loadContacts(query = '') {
    const res = await fetch(`${API}?q=${encodeURIComponent(query)}`);
    const contacts = await res.json();
    tableBody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${c.firstName} ${c.lastName}</td><td>${c.email}</td><td>${c.phoneNumber}</td><td>${c.category}</td>
            <td><button class="edit-btn" data-id="${c.id}">Edit</button> <button class="delete-btn" data-id="${c.id}">Delete</button></td>`;
        tableBody.appendChild(tr);
    });
    attachButtons();
}

function attachButtons() {
    document.querySelectorAll('.edit-btn').forEach(b => b.onclick = () => openEdit(b.dataset.id));
    document.querySelectorAll('.delete-btn').forEach(b => b.onclick = () => deleteContact(b.dataset.id));
}

async function openEdit(id) {
    const res = await fetch(`${API}/${id}`);
    const c = await res.json();
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    document.getElementById('modalTitle').textContent = 'Edit Contact';
    modal.style.display = 'flex';
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const body = { firstName: document.getElementById('firstName').value, lastName: document.getElementById('lastName').value, email: document.getElementById('email').value, phoneNumber: document.getElementById('phoneNumber').value, address: document.getElementById('address').value, category: document.getElementById('category').value };
    
    try {
        if (id) {
            await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        } else {
            await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        }
    } finally { modal.style.display = 'none'; form.reset(); document.getElementById('contactId').value = ''; }
    loadContacts(searchInput.value);
};

async function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadContacts(searchInput.value);
}

document.getElementById('addBtn').onclick = () => { form.reset(); document.getElementById('contactId').value = ''; document.getElementById('modalTitle').textContent = 'Add Contact'; modal.style.display = 'flex'; };
document.querySelector('.close').onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

searchInput.addEventListener('input', (e) => loadContacts(e.target.value));
loadContacts();
