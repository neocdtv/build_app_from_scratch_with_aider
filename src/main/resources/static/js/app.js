const API = '/api/contacts';
const tbody = document.querySelector('#contactTable tbody');

async function loadContacts(query = '') {
    const res = await fetch(`${API}/search?q=${query}`);
    const contacts = await res.json();
    tbody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.category}</td>
            <td>
                <button onclick='editContact(${JSON.stringify(c).replace(/'/g, "&#39;")})'>Edit</button>
                <button onclick="deleteContact(${c.id})">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

async function saveContact(e) {
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
    const url = id ? `${API}/${id}` : API;
    await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
    closeModal();
    loadContacts();
}

async function deleteContact(id) {
    if(confirm('Delete this contact?')) {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        loadContacts();
    }
}

function editContact(c) {
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    openModal();
}

function openModal() { document.getElementById('modal').style.display = 'block'; }
function closeModal() { 
    document.getElementById('modal').style.display = 'none'; 
    document.getElementById('contactForm').reset();
    document.getElementById('contactId').value = '';
}

document.getElementById('contactForm').addEventListener('submit', saveContact);
loadContacts();
