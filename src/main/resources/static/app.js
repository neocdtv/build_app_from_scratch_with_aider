document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const tableBody = document.querySelector('#contactTable tbody');
    const searchInput = document.getElementById('searchInput');
    
    let isEditing = false;

    async function fetchContacts(query = '') {
        const url = query ? `/api/contacts/search?q=${encodeURIComponent(query)}` : '/api/contacts';
        const res = await fetch(url);
        const contacts = await res.json();
        renderTable(contacts);
    }

    function renderTable(contacts) {
        tableBody.innerHTML = '';
        contacts.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.address}</td>
                <td>${c.category}</td>
                <td class="actions">
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    window.editContact = async (id) => {
        const res = await fetch(`/api/contacts/${id}`);
        const contact = await res.json();
        
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        
        submitBtn.textContent = 'Update Contact';
        cancelBtn.classList.remove('hidden');
        isEditing = true;
        window.scrollTo(0, 0);
    };

    window.deleteContact = async (id) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        fetchContacts(searchInput.value);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        try {
            if (isEditing) {
                await fetch(`/api/contacts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                await fetch('/api/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            form.reset();
            document.getElementById('contactId').value = '';
            submitBtn.textContent = 'Add Contact';
            cancelBtn.classList.add('hidden');
            isEditing = false;
            fetchContacts(searchInput.value);
        } catch (err) {
            alert('Error saving contact. Check console for details.');
            console.error(err);
        }
    });

    cancelBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('contactId').value = '';
        submitBtn.textContent = 'Add Contact';
        cancelBtn.classList.add('hidden');
        isEditing = false;
    });

    searchInput.addEventListener('input', (e) => {
        fetchContacts(e.target.value);
    });

    fetchContacts();
});
