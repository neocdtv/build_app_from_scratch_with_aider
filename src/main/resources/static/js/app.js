document.addEventListener('DOMContentLoaded', () => {
    const contactsBody = document.getElementById('contactsBody');
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactModal');
    const addContactBtn = document.getElementById('addContactBtn');
    const closeBtn = document.querySelector('.close');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchBtn = document.getElementById('searchBtn');

    const fetchContacts = async (search = '', category = '') => {
        const url = `/api/contacts?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
        try {
            const response = await fetch(url);
            const contacts = await response.json();
            renderContacts(contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const renderContacts = (contacts) => {
        contactsBody.innerHTML = '';
        contacts.forEach(c => {
            const row = `<tr>
                <td>${c.firstName} ${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.category || '-'}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="openEditModal(${c.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>`;
            contactsBody.innerHTML += row;
        });
    };

    const saveContact = async (e) => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const dto = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/contacts/${id}` : '/api/contacts';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dto)
            });

            if (response.ok) {
                closeModal();
                fetchContacts();
            } else {
                const error = await response.json();
                alert('Error: ' + JSON.stringify(error));
            }
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    window.deleteContact = async (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
                if (response.ok) fetchContacts();
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        }
    };

    window.openEditModal = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            const c = await response.json();
            
            document.getElementById('modalTitle').innerText = 'Edit Contact';
            document.getElementById('contactId').value = c.id;
            document.getElementById('firstName').value = c.firstName;
            document.getElementById('lastName').value = c.lastName;
            document.getElementById('email').value = c.email;
            document.getElementById('phoneNumber').value = c.phoneNumber;
            document.getElementById('address').value = c.address;
            document.getElementById('category').value = c.category;
            
            contactModal.style.display = 'block';
        } catch (error) {
            console.error('Error loading contact:', error);
        }
    };

    const openAddModal = () => {
        document.getElementById('modalTitle').innerText = 'Add Contact';
        contactForm.reset();
        document.getElementById('contactId').value = '';
        contactModal.style.display = 'block';
    };

    const closeModal = () => {
        contactModal.style.display = 'none';
    };

    addContactBtn.onclick = openAddModal;
    closeBtn.onclick = closeModal;
    contactForm.onsubmit = saveContact;
    searchBtn.onclick = () => fetchContacts(searchInput.value, categoryFilter.value);
    
    window.onclick = (event) => {
        if (event.target == contactModal) closeModal();
    };

    fetchContacts();
});
