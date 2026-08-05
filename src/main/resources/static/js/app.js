document.addEventListener('DOMContentLoaded', () => {
    const contactList = document.getElementById('contact-list');
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('contact-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.querySelector('.close');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    const fetchContacts = async (search = '', category = '') => {
        let url = '/api/contacts?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        
        try {
            const response = await fetch(url);
            const contacts = await response.json();
            renderContacts(contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const renderContacts = (contacts) => {
        contactList.innerHTML = '';
        contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.firstName} ${contact.lastName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>${contact.category || ''}</td>
                <td>
                    <button class="btn btn-primary edit-btn" data-id="${contact.id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${contact.id}">Delete</button>
                </td>
            `;
            contactList.appendChild(row);
        });

        // Re-attach event listeners to new buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteContact(btn.dataset.id));
        });
    };

    const deleteContact = async (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchContacts(searchInput.value, categoryFilter.value);
                } else {
                    alert('Failed to delete contact');
                }
            } catch (error) {
                console.error('Error deleting contact:', error);
            }
        }
    };

    const openEditModal = async (id) => {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            const contact = await response.json();
            
            document.getElementById('modal-title').innerText = 'Edit Contact';
            document.getElementById('contact-id').value = contact.id;
            document.getElementById('first-name').value = contact.firstName;
            document.getElementById('last-name').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phone').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address || '';
            document.getElementById('category').value = contact.category || '';
            
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error loading contact:', error);
        }
    };

    const saveContact = async (e) => {
        e.preventDefault();
        const id = document.getElementById('contact-id').value;
        const isEdit = id !== '';

        const data = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value
        };

        const url = isEdit ? `/api/contacts/${id}` : '/api/contacts';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                closeModal();
                contactForm.reset();
                fetchContacts(searchInput.value, categoryFilter.value);
            } else {
                const errorData = await response.json();
                alert('Error: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    const closeModal = () => {
        modal.style.display = 'none';
        contactForm.reset();
        document.getElementById('contact-id').value = '';
    };

    // Event Listeners
    openModalBtn.addEventListener('click', () => {
        document.getElementById('modal-title').innerText = 'Add Contact';
        document.getElementById('contact-id').value = '';
        contactForm.reset();
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    contactForm.addEventListener('submit', saveContact);
    searchInput.addEventListener('input', () => fetchContacts(searchInput.value, categoryFilter.value));
    categoryFilter.addEventListener('change', () => fetchContacts(searchInput.value, categoryFilter.value));

    // Initial Load
    fetchContacts();
});
