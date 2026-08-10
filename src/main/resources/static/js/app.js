const API_BASE_URL = '/api/contacts';

let allContacts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

async function loadContacts() {
    try {
        const response = await fetch(API_BASE_URL);
        allContacts = await response.json();
        renderContacts(allContacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        address: document.getElementById('address').value,
        category: document.getElementById('category').value
    };
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        
        if (response.ok) {
            document.getElementById('contactForm').reset();
            loadContacts();
        } else {
            alert('Error creating contact');
        }
    } catch (error) {
        console.error('Error creating contact:', error);
        alert('Error creating contact');
    }
}

async function handleSearch() {
    const query = document.getElementById('searchInput').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        renderContacts(results);
    } catch (error) {
        console.error('Error searching contacts:', error);
    }
}

async function editContact(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const contact = await response.json();
        
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phoneNumber').value = contact.phoneNumber;
        document.getElementById('address').value = contact.address;
        document.getElementById('category').value = contact.category;
        
        document.querySelector('.form-section h2').textContent = 'Edit Contact';
    } catch (error) {
        console.error('Error loading contact for edit:', error);
        alert('Error loading contact');
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadContacts();
        } else {
            alert('Error deleting contact');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact');
    }
}

function renderContacts(contacts) {
    const container = document.getElementById('contactsList');
    container.innerHTML = '';
    
    if (contacts.length === 0) {
        container.innerHTML = '<p>No contacts found.</p>';
        return;
    }
    
    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <div class="contact-info">
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <p>${contact.email}</p>
                <p>${contact.phoneNumber}</p>
                <p>${contact.address}</p>
                <p><strong>Category:</strong> ${contact.category}</p>
            </div>
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(${contact.id})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}
