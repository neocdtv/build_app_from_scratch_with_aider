document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const modal = document.getElementById('contactModal');
  const closeBtn = document.querySelector('.close');
  const contactForm = document.getElementById('contactForm');
  const saveButton = document.getElementById('saveButton');
  const contactTableBody = document.getElementById('contactList');

  let editingId = null;

  // Open modal
  addBtn.onclick = () => {
    editingId = null;
    document.getElementById('modalTitle').innerText = 'Add Contact';
    contactForm.reset();
    modal.style.display = 'block';
  };

  // Close modal
  closeBtn.onclick = () => modal.style.display = 'none';

  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
  };

  // Submit form
  contactForm.onsubmit = async (e) => {
    e.preventDefault();
    const contactData = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      address: document.getElementById('address').value.trim(),
      category: document.getElementById('category').value
    };

    try {
      const response = editingId
        ? await fetch(`/api/contacts/${editingId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(contactData)
          })
        : await fetch('/api/contacts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(contactData)
          });

      if (!response.ok) throw new Error('Request failed');

      modal.style.display = 'none';
      loadContacts();
    } catch (err) {
      alert('Error saving contact: ' + err.message);
    }
  };

  // Load contacts on startup
  async function loadContacts() {
    const search = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;

    let url = `/api/contacts?${new URLSearchParams({ search, category })}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load contacts');
      const contacts = await response.json();
      contactTableBody.innerHTML = '';

      contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${contact.firstName} ${contact.lastName}</td>
          <td><a href="mailto:${contact.email}">${contact.email}</a></td>
          <td><a href="tel:${contact.phoneNumber}">${contact.phoneNumber}</a></td>
          <td>${contact.address || ''}</td>
          <td>${contact.category || ''}</td>
          <td>
            <button onclick="editContact(${contact.id})">Edit</button>
            <button onclick="deleteContact(${contact.id})">Delete</button>
          </td>
        `;
        contactTableBody.appendChild(row);
      });
    } catch (err) {
      alert('Error loading contacts: ' + err.message);
    }
  }

  // Edit button
  window.editContact = async (id) => {
    try {
      const response = await fetch(`/api/contacts/${id}`);
      if (!response.ok) throw new Error('Failed to load contact');
      const contact = await response.json();

      document.getElementById('modalTitle').innerText = 'Edit Contact';
      editingId = id;

      document.getElementById('contactId').value = contact.id;
      document.getElementById('firstName').value = contact.firstName || '';
      document.getElementById('lastName').value = contact.lastName || '';
      document.getElementById('email').value = contact.email || '';
      document.getElementById('phoneNumber').value = contact.phoneNumber || '';
      document.getElementById('address').value = contact.address || '';
      if (contact.category) {
        document.getElementById('category').value = contact.category;
      }

      modal.style.display = 'block';
    } catch (err) {
      alert('Error loading contact: ' + err.message);
    }
  };

  // Delete button
  window.deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete contact');
      loadContacts();
    } catch (err) {
      alert('Error deleting contact: ' + err.message);
    }
  };

  // Search & filter
  document.getElementById('searchInput').addEventListener('input', loadContacts);
  document.getElementById('categoryFilter').addEventListener('change', loadContacts);

  // Initial load
  loadContacts();
});
