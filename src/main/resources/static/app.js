const API_URL = '/api/contacts';
const searchInput = document.getElementById('searchInput');
const form = document.getElementById('contactForm');
const editIdField = document.getElementById('editId');
const tbody = document.getElementById('contactsBody');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Fetch & Render
async function loadContacts(query = '') {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    const contacts = await res.json();
    renderTable(contacts);
}

function renderTable(contacts) {
    tbody.innerHTML = '';
    contacts.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="First Name">${c.firstName}</td>
            <td data-label="Last Name">${c.lastName}</td>
            <td data-label="Email">${c.email}</td>
            <td data-label="Phone">${c.phoneNumber}</td>
            <td data-label="Address">${c.address}</td>
            <td data-label="Category">${c.category}</td>
            <td>
                <button class="edit-btn" data-id="${c.id}">Edit</button>
                <button class="delete-btn" data-id="${c.id}">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
    attachEventListeners();
}

// Form Submit (Create/Update)
form.addEventListener('submit', async e => {
    e.preventDefault();
    const id = editIdField.value;
    const payload = {
        id: id || undefined,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.phoneNumber || !payload.category) {
        alert('Please fill all required fields.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) { alert('Invalid email format.'); return; }

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;
        await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        form.reset(); editIdField.value = ''; 
        submitBtn.textContent = 'Add Contact';
        cancelBtn.style.display = 'none';
        loadContacts(searchInput.value);
    } catch (err) { console.error(err); alert('Operation failed.'); }
});

// Cancel Edit
cancelBtn.addEventListener('click', () => {
    form.reset(); editIdField.value = '';
    submitBtn.textContent = 'Add Contact';
    cancelBtn.style.display = 'none';
});

// Edit Click Handler
function attachEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            const res = await fetch(`${API_URL}/${id}`);
            const data = await res.json();
            editIdField.value = data.id;
            document.getElementById('firstName').value = data.firstName;
            document.getElementById('lastName').value = data.lastName;
            document.getElementById('email').value = data.email;
            document.getElementById('phoneNumber').value = data.phoneNumber;
            document.getElementById('address').value = data.address;
            document.getElementById('category').value = data.category;
            submitBtn.textContent = 'Update Contact';
            cancelBtn.style.display = 'inline-block';
            window.scrollTo(0,0);
        };
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
            if (!confirm('Delete this contact?')) return;
            await fetch(`${API_URL}/${btn.dataset.id}`, { method: 'DELETE' });
            loadContacts(searchInput.value);
        };
    });
}

// Search Listener
searchInput.addEventListener('input', e => loadContacts(e.target.value));

// Initial Load
loadContacts();
