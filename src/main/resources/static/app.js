document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/api/contacts';
    
    // DOM Elements
    const contactForm = document.getElementById('contactForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const contactsBody = document.getElementById('contactsBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const formTitle = document.getElementById('formTitle');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let isEditing = false;

    // Initial Load
    fetchContacts();

    // Event Listeners
    contactForm.addEventListener('submit', handleFormSubmit);
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchContacts(query);
        } else {
            fetchContacts();
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') searchBtn.click();
    });

    cancelBtn.addEventListener('click', resetForm);

    async function fetchContacts() {
        showLoading(true);
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`Failed to load contacts: ${res.status}`);
            
            const data = await res.json();
            renderTable(data);
            document.getElementById('contactCount').textContent = data.length;
        } catch (error) {
            console.error(error);
            alert('Error loading contacts. Check browser console.');
        } finally {
            showLoading(false);
        }
    }

    async function searchContacts(query) {
        showLoading(true);
        try {
            const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error(`Search failed: ${res.status}`);
            
            const data = await res.json();
            renderTable(data, true); // True indicates it's a filtered view
            document.getElementById('contactCount').textContent = `${data.length} results`;
            contactForm.reset();
        } catch (error) {
            console.error(error);
            alert('Error searching contacts.');
        } finally {
            showLoading(false);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            address: document.getElementById('address').value.trim() || 'N/A',
            category: document.getElementById('category').value
        };

        // Client-side validation enhancement before sending
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.category) {
            alert("Please fill out all required fields.");
            return;
        }

        const id = document.getElementById('contactId').value;
        let url = API_BASE;
        let method = 'POST';
        
        if (isEditing && id) {
            url = `${API_BASE}/${id}`;
            method = 'PUT';
            formData.id = parseInt(id, 10); // Ensure ID is passed in body for service layer mapping
        } else {
            delete formData.id; 
        }

        try {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok && !isEditing) throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} contact`);
            
            resetForm();
            // Refresh data after add/update (use search query state if active)
            if(searchInput.value.trim()) {
                searchContacts(searchInput.value.trim());
            } else {
                fetchContacts();
            }
        } catch (error) {
            console.error(error);
            alert('Operation failed. Please check form details.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = isEditing ? 'Update Contact' : 'Save Contact';
        }
    }

    async function deleteContact(id, event) {
        event.stopPropagation(); // Prevent row click from triggering edit
        
        if(!confirm('Are you sure you want to delete this contact?')) return;
        
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!res.ok && res.status !== 204) throw new Error('Delete failed');
            
            alert('Contact deleted successfully.');
            if(searchInput.value.trim()) searchContacts(searchInput.value.trim());
            else fetchContacts();
        } catch (error) {
            console.error(error);
            alert('Error deleting contact.');
        }
    }

    function populateForm(contact) {
        document.getElementById('contactId').value = contact.id;
        document.getElementById('firstName').value = contact.firstName || '';
        document.getElementById('lastName').value = contact.lastName || '';
        document.getElementById('email').value = contact.email || '';
        document.getElementById('phoneNumber').value = contact.phoneNumber || '';
        document.getElementById('address').value = contact.address || '';
        document.getElementById('category').value = contact.category || 'Other';
        
        formTitle.textContent = 'Edit Contact';
        saveBtn.textContent = 'Update Contact';
        cancelBtn.style.display = 'inline-block';
        isEditing = true;

        // Scroll to top smoothly on mobile/desktop for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
        contactForm.reset();
        document.getElementById('contactId').value = '';
        formTitle.textContent = 'Add New Contact';
        saveBtn.textContent = 'Save Contact';
        cancelBtn.style.display = 'none';
        isEditing = false;
    }

    function renderTable(contactsData) {
        contactsBody.innerHTML = '';
        
        if (Array.isArray(contactsData)) {
            contactsData.forEach(contact => {
                const tr = document.createElement('tr');
                
                // Click row to edit
                tr.addEventListener('click', () => populateForm(contact));
                
                tr.innerHTML = `
                    <td>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</td>
                    <td><a href="mailto:${contact.email}" style="color:var(--primary-color);text-decoration:none;">${escapeHtml(contact.email)}</a></td>
                    <td>${escapeHtml(contact.phoneNumber)}</td>
                    <td><span class="category-tag">${escapeHtml(contact.category)}</span></td>
                    <td>
                        <button onclick="event.stopPropagation(); document.querySelector('#app').populateFromRow(${JSON.stringify(contact).replace(/"/g, '&quot;')})" class="action-btn edit-btn">Edit</button>
                        <button onclick="deleteContact('${contact.id}', event)" class="action-btn delete-btn">Delete</button>
                    </td>
                `;
                
                // Fix inline JS scope issue by attaching handler properly in modern way or just using standard onclick binding
                tr.innerHTML = `
                    <td>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</td>
                    <td><a href="mailto:${contact.email}" style="color:var(--primary-color);text-decoration:none;">${escapeHtml(contact.email)}</a></td>
                    <td>${escapeHtml(contact.phoneNumber)}</td>
                    <td><span class="category-tag">${escapeHtml(contact.category)}</span></td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${contact.id}">Edit</button>
                        <button class="action-btn delete-btn" data-id="${contact.id}">Delete</button>
                    </td>
                `;

                contactsBody.appendChild(tr);
                
                // Attach click listeners to buttons after insertion for cleaner scope management
                const editBtn = tr.querySelector('.edit-btn');
                editBtn.addEventListener('click', (e) => { e.stopPropagation(); populateForm(contact); });
            });
        } else if(contactsData.length === 0) {
            contactsBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted); padding: 20px;">No contacts found.</td></tr>`;
        }
    }

    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    // Utility to prevent XSS in HTML insertion
    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return text ? String(text).replace(/[&<>"']/g, m => map[m]) : '';
    }

    // Expose deleteContact globally for inline onclick handlers (fallback safety) if needed by older browsers
    window.deleteContact = deleteContact;
});
