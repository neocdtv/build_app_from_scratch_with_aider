const API_URL = '/api/contacts';
let contacts = [];

// DOM Elements
const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const searchQuery = document.getElementById('search-query');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

// Fetch all contacts
async function fetchContacts(url = API_URL) {
    const response = await fetch(url);
    contacts = await response.json();
    renderContacts();
}

function renderContacts() {
    contactList.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.firstName} ${c.lastName}</td>
            <td>${c.email}</td>
            <td>${c.phoneNumber}</td>
            <td>${c.category}</td>
            <td>
                <button class="btn-edit" onclick="editContact(${c.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${c.id})">Delete</button>
            </td>
        `;
        contactList.appendChild(tr);
    });
}

// Create or Update
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contact-id').value;
    const contactData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });

    resetForm();
    fetchContacts();
});

async function editContact(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const c = await response.json();
    document.getElementById('contact-id').value = c.id;
    document.getElementById('firstName').value = c.firstName;
    document.getElementById('lastName').value = c.lastName;
    document.getElementById('email').value = c.email;
    document.getElementById('phoneNumber').value = c.phoneNumber;
    document.getElementById('address').value = c.address;
    document.getElementById('category').value = c.category;
    
    formTitle.innerText = "Edit Contact";
    cancelBtn.style.display = "inline-block";
}

async function deleteContact(id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
    }
}

function resetForm() {
    contactForm.reset();
    document.getElementById('contact-id').value = '';
    formTitle.innerText = "Add Contact";
    cancelBtn.style.display = "none";
}

cancelBtn.addEventListener('click', resetForm);

// Search
searchBtn.addEventListener('click', () => fetchContacts(`${API_URL}/search?q=${searchQuery.value}`));
clearBtn.addEventListener('click', () => {
    searchQuery.value = '';
    fetchContacts();
});

// Init
fetchContacts();
