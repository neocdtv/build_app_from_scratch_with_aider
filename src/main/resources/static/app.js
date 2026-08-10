const API_URL = '/api/contacts';
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    document.getElementById('contactForm').addEventListener('submit', handleSubmit);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') loadContacts();
    });
});

async function loadContacts() {
    const query = document.getElementById('searchInput').value.trim();
    const url = query ? `${API_URL}/search?q=${encodeURIComponent(query)}` : API_URL;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderTable(data);
    } catch (err) { console.error('Fetch error:', err); }
}

function renderTable(contacts) {
    const tbody = document.getElementById('contactList');
    tbody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${esc(c.firstName)}</td><td>${esc(c.lastName)}</td><td>${esc(c.email)}</td>
            <td>${esc(c.phoneNumber)}</td><td>${esc(c.address)}</td><td>${esc(c.category)}</td>
            <td>
                <button class="edit-btn" onclick="startEdit(${c.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
        firstName: val('firstName'), lastName: val('lastName'), email: val('email'),
        phoneNumber: val('phoneNumber'), address: val('address'), category: val('category')
    };
    
    try {
        let res;
        if (currentEditId) {
            res = await fetch(`${API_URL}/${currentEditId}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        } else {
            res = await fetch(API_URL, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        }
        
        if (res.ok || res.status === 201) {
            resetForm();
            loadContacts();
        } else {
            const err = await res.json();
            alert('Validation/Server Error: ' + (err.message || JSON.stringify(err)));
        }
    } catch (err) { console.error(err); }
}

async function deleteContact(id) {
    if(!confirm('Delete this contact?')) return;
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.status === 204) loadContacts();
}

function startEdit(id) {
    fetch(`${API_URL}/${id}`).then(r => r.json()).then(c => {
        currentEditId = c.id;
        document.getElementById('contactId').value = c.id;
        document.getElementById('firstName').value = c.firstName;
        document.getElementById('lastName').value = c.lastName;
        document.getElementById('email').value = c.email;
        document.getElementById('phoneNumber').value = c.phoneNumber;
        document.getElementById('address').value = c.address;
        document.getElementById('category').value = c.category;
        document.getElementById('saveBtn').textContent = 'Update Contact';
    });
}

function resetForm() {
    currentEditId = null;
    document.getElementById('contactForm').reset();
    document.getElementById('saveBtn').textContent = 'Save Contact';
}

function val(id) { return document.getElementById(id).value.trim(); }
function esc(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }
