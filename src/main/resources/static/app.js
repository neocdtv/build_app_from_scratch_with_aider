document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const modal = document.getElementById('contactModal');
    const addBtn = document.getElementById('addContactBtn');
    const closeSpan = document.getElementsByClassName('close')[0];
    const searchInput = document.getElementById('searchInput');

    // Open Modal for Add
    addBtn.onclick = () => {
        resetForm();
        document.getElementById('modalTitle').innerText = 'Add Contact';
        modal.style.display = 'block';
    };

    // Close Modal
    closeSpan.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        loadContacts(e.target.value);
    });

    // Initial Load
    loadContacts();

    // Form Submission (Create or Update)
    contactForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const url = id ? `/api/contacts/${id}` : '/api/contacts';
        const method = id ? 'PUT' : 'POST';

        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                modal.style.display = 'none';
                loadContacts(searchInput.value);
            } else {
                alert('Error saving contact');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Load Contacts List
    async function loadContacts(query = '') {
        const tbody = document.querySelector('#contactsTable tbody');
        tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
        
        try {
            let url = '/api/contacts';
            if (query) url += `/search?q=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            const contacts = await response.json();
            
            tbody.innerHTML = '';
            contacts.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${c.firstName} ${c.lastName}</td>
                    <td>${c.email}</td>
                    <td>${c.phoneNumber}</td>
                    <td><span class="badge">${c.category}</span></td>
                    <td>
                        <button class="edit-btn" onclick='editContact(${JSON.stringify(c)})'>Edit</button>
                        <button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="5">Failed to load contacts.</td></tr>';
        }
    }

    // Delete Contact
    async function deleteContact(id) {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
            loadContacts(searchInput.value);
        } catch (error) {
            alert('Failed to delete contact');
        }
    }

    // Edit Contact (Populate Form)
    window.editContact = (contact) => {
        document.getElementById('modalTitle').innerText = 'Edit Contact';
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        modal.style.display = 'block';
    };

    // Reset Form
    function resetForm() {
        document.getElementById('contactId').value = '';
        contactForm.reset();
    }
});
