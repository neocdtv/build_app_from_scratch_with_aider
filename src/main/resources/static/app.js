const API_URL = '/api/contacts';
const contactForm = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const searchInput = document.getElementById('searchInput');
const cancelBtn = document.getElementById('cancelBtn');

document.addEventListener('DOMContentLoaded', fetchContacts);

// Fetch all contacts
async function fetchContacts() {
    const response = await fetch(API_URL);
    const contacts = await response.json();
    renderTable(contacts);
}

// Search contacts
searchInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        const contacts = await response.json();
        renderTable(contacts);
    } else {
        fetchContacts();
    }
});

// Render table rows
function renderTable(contacts) {
    contactList.innerHTML = '';
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>${contact.category}</td>
            <td>
                <button class="btn-edit" onclick="editContact(${JSON.stringify(contact).replace(/"/g, '&quot;')})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        contactList.appendChild(row);
    });
}

// Save (Create or Update)
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('contactId').value;
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

// Edit contact (populate form)
window.editContact = (contact) => {
    document.getElementById('contactId').value = contact.id;
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phoneNumber').value = contact.phoneNumber;
    document.getElementById('address').value = contact.address;
    document.getElementById('category').value = contact.category;
};

// Delete contact
window.deleteContact = async (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchContacts();
    }
};

// Reset form
function resetForm() {
    contactForm.reset();
    document.getElementById('contactId').value = '';
}

cancelBtn.addEventListener('click', resetForm);
