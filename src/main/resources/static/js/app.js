document.addEventListener('DOMContentLoaded', function() {
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchBtn = document.getElementById('searchBtn');
    const addContactBtn = document.getElementById('addContactBtn');
    const contactModal = document.getElementById('contactModal');
    const modalTitle = document.getElementById('modalTitle');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.querySelector('.close');
    
    let contacts = [];
    let editingContactId = null;
    
    // Load contacts on page load
    loadContacts();
    
    // Event listeners
    searchBtn.addEventListener('click', () => {
        loadContacts(searchInput.value, categoryFilter.value);
    });
    
    addContactBtn.addEventListener('click', () => {
        openModal();
    });
    
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.style.display === 'block') {
            closeModal();
        }
    });
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Functions
    async function loadContacts(search = '', category = '') {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            
            const response = await fetch(`/api/contacts?${params.toString()}`);
            contacts = await response.json();
            renderContacts(contacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
            contactsList.innerHTML = '<p class="no-contacts">Error loading contacts. Please try again.</p>';
        }
    }
    
    function renderContacts(contacts) {
        if (contacts.length === 0) {
            contactsList.innerHTML = '<p class="no-contacts">No contacts found. Add your first contact!</p>';
            return;
        }
        
        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-item">
                <div class="contact-info">
                    <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
                    <div class="contact-details">${contact.email}</div>
                </div>
                <div class="contact-info">
                    <div class="contact-details">${contact.phoneNumber}</div>
                    <div class="contact-details">${contact.category || 'Uncategorized'}</div>
                </div>
                <div class="contact-info">
                    <div class="contact-details">${contact.address || 'No address'}</div>
                </div>
                <div class="contact-info">
                    <div class="contact-details">Added: ${formatDate(contact.createdAt)}</div>
                </div>
                <div class="contact-actions">
                    <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    function openModal(contact = null) {
        editingContactId = contact ? contact.id : null;
        modalTitle.textContent = contact ? 'Edit Contact' : 'Add Contact';
        
        if (contact) {
            document.getElementById('contactId').value = contact.id;
            document.getElementById('firstName').value = contact.firstName;
            document.getElementById('lastName').value = contact.lastName;
            document.getElementById('email').value = contact.email;
            document.getElementById('phoneNumber').value = contact.phoneNumber;
            document.getElementById('address').value = contact.address || '';
            document.getElementById('category').value = contact.category || '';
        } else {
            contactForm.reset();
            document.getElementById('contactId').value = '';
        }
        
        contactModal.style.display = 'block';
        clearFormErrors();
    }
    
    function closeModal() {
        contactModal.style.display = 'none';
        editingContactId = null;
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            address: document.getElementById('address').value.trim(),
            category: document.getElementById('category').value
        };
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        try {
            if (editingContactId) {
                await fetch(`/api/contacts/${editingContactId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch('/api/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }
            
            closeModal();
            loadContacts(searchInput.value, categoryFilter.value);
        } catch (error) {
            console.error('Error saving contact:', error);
            alert('Error saving contact. Please check the form for errors.');
        }
    }
    
    function validateForm(formData) {
        let isValid = true;
        
        // First name validation
        const firstNameInput = document.getElementById('firstName');
        if (!formData.firstName) {
            showError(firstNameInput, 'First name is required');
            isValid = false;
        } else if (formData.firstName.length > 50) {
            showError(firstNameInput, 'First name must be less than 50 characters');
            isValid = false;
        }
        
        // Last name validation
        const lastNameInput = document.getElementById('lastName');
        if (!formData.lastName) {
            showError(lastNameInput, 'Last name is required');
            isValid = false;
        } else if (formData.lastName.length > 50) {
            showError(lastNameInput, 'Last name must be less than 50 characters');
            isValid = false;
        }
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Phone number validation
        const phoneInput = document.getElementById('phoneNumber');
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!formData.phoneNumber) {
            showError(phoneInput, 'Phone number is required');
            isValid = false;
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            showError(phoneInput, 'Phone number must be in E.164 format (e.g., +1234567890)');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorSpan = formGroup.querySelector('.error');
        
        formGroup.classList.add('has-error');
        errorSpan.textContent = message;
    }
    
    function clearFormErrors() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('has-error'));
        
        const errorSpans = document.querySelectorAll('.error');
        errorSpans.forEach(span => span.textContent = '');
    }
    
    window.editContact = async function(id) {
        try {
            const response = await fetch(`/api/contacts/${id}`);
            const contact = await response.json();
            openModal(contact);
        } catch (error) {
            console.error('Error loading contact:', error);
            alert('Error loading contact details.');
        }
    };
    
    window.deleteContact = async function(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                await fetch(`/api/contacts/${id}`, {
                    method: 'DELETE'
                });
                loadContacts(searchInput.value, categoryFilter.value);
            } catch (error) {
                console.error('Error deleting contact:', error);
                alert('Error deleting contact.');
            }
        }
    };
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
});
