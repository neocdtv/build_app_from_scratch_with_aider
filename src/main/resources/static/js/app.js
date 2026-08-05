document.addEventListener('DOMContentLoaded', () => {
    const contactsBody = document.getElementById('contactsBody');
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let contacts = [];

    const fetchContacts = async () => {
        const search = searchInput.value;
        const category = categoryFilter.value;
        let url = `/api/contacts?`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}`;
        else url += ``;

        try {
            const response = await fetch(url);
            contacts = await response.json();
            renderContacts();
        } catch (err) {
            console.error("Failed to fetch contacts", err);
        }
    };

    const renderContacts = () => {
        contactsBody.innerHTML = contacts.map(c => `
            <tr>
                <td>${c.firstName} ${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.category || '-'}</td>
                <td>
                    <button onclick="editContact(${c.id})" class="btn-secondary">Edit</button>
                    <button onclick="deleteContact(${c.id})" class="btn-danger">Delete</button>
                </td>
            </tr>
        `).join('');
    };

    window.editContact = (id) => {
        const c = contacts.find(contact => contact.id === id);
        if (!c) return;
        document.getElementById('modalTitle').innerText = 'Edit Contact';
        document.getElementById('contactId').value = c.id;
        document.getElementById('firstName').value = c.firstName;
        document.getElementById('lastName').value = c.lastName;
        document.getElementById('email').value = c.email;
        document.getElementById('phoneNumber').value = c.phoneNumber;
        document.getElementById('address').value = c.address || '';
        document.getElementById('category').value = c.category || '';
        contactModal.style.display = 'flex';
    };

    window.deleteContact = async (id) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        fetchContacts();
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const payload = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/contacts/${id}` : '/api/contacts';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                contactModal.style.display = 'none';
                contactForm.reset();
                fetchContacts();
            } else {
                const err = await response.json();
                alert('Error: ' + err.message);
            }
        } catch (err) {
            alert('Failed to save contact');
        }
    });

    openModalBtn.onclick = () => {
        document.getElementById('modalTitle').innerText = 'Add Contact';
        document.getElementById('contactId').value = '';
        contactForm.reset();
        contactModal.style.display = 'flex';
    };
    closeModalBtn.onclick = () => contactModal.style.display = 'none';
    searchInput.oninput = fetchContacts;
    categoryFilter.onchange = fetchContacts;

    fetchContacts();
});
