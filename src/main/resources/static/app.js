const API = '/api/contacts';
const form = document.getElementById('contactForm');
const list = document.getElementById('contactList');
const searchInput = document.getElementById('searchInput');
const toggleBtn = document.getElementById('toggleFormBtn');
const submitBtn = document.getElementById('submitBtn');

fetchContacts();

toggleBtn.addEventListener('click', () => { form.classList.toggle('visible'); if(form.classList.contains('visible')) resetForm(); });

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const body = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API}/${id}` : API;
        await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
        resetForm();
        form.classList.remove('visible');
        loadContacts(searchInput.value);
    } catch (err) { console.error(err); alert('Save failed. Check console.'); }
});

searchInput.addEventListener('input', (e) => loadContacts(e.target.value));

async function fetchContacts(query = '') { await loadContacts(query); }

async function loadContacts(query) {
    const url = query ? `${API}/search?q=${encodeURIComponent(query)}` : API;
    const res = await fetch(url);
    const contacts = await res.json();
    list.innerHTML = '';
    contacts.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td><td>${c.email}</td><td>${c.phone || '-'}</td><td>${c.category || '-'}</td>
            <td class="actions"><button class="edit-btn" onclick="editContact(${c.id})">Edit</button> <button class="delete-btn" onclick="deleteContact(${c.id})">Del</button></td>
        `;
        list.appendChild(row);
    });
}

window.editContact = (id) => {
    fetch(`${API}/${id}`).then(r => r.json()).then(c => {
        document.getElementById('contactId').value = c.id;
        document.getElementById('firstName').value = c.firstName;
        document.getElementById('lastName').value = c.lastName;
        document.getElementById('email').value = c.email;
        document.getElementById('phone').value = c.phone;
        document.getElementById('address').value = c.address;
        document.getElementById('category').value = c.category;
        submitBtn.textContent = 'Update';
        form.classList.add('visible');
    });
};

window.deleteContact = async (id) => {
    if(!confirm('Delete this contact?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadContacts(searchInput.value);
};

function resetForm() {
    form.reset();
    document.getElementById('contactId').value = '';
    submitBtn.textContent = 'Save';
}
