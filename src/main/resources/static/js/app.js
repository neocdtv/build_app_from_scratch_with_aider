const API_URL = '/api/contacts';
const modal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');

document.addEventListener('DOMContentLoaded', loadContacts);

document.getElementById('openAddModal').onclick = () => {
    contactForm.reset();
    document.getElementById('contactId').value = '';
    document.getElementById('modalTitle').innerText = 'Add Contact';
    modal.style.display = 'block';
};

document.getElementById('closeModal').onclick = () => modal.style.display = 'none';

async function loadContacts() {
    const search = document.getElementById('searchInput').value;
    const response = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
    const contacts = await response.json();
    
    contactList.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.category || ''}</td>
            <td>
                <button onclick="editContact(${c.id})">Edit</button>
                <button onclick="deleteContact(${c.id})" style="color:red">Delete</button>
            </td>
        `;
        contactList.appendChild(tr);
    });
}

contactForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value,
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            category: data.category
        } : data)
    });

    if (response.ok) {
        modal.style.display = 'none';
        loadContacts();
    } else {
        const err = await response.json();
        alert('Error: ' + err.message);
    }
};

async function editContact(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const c = await response.json();
    document.getElementById('contactId').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    document.getElementById('modalTitle').innerText = 'Edit Contact';
    modal.style.display = 'block';
}

async function deleteContact(id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadContacts();
    }
}
