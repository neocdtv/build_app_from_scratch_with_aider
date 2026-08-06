const API = '/api/contacts';
let contacts = [];

document.addEventListener('DOMContentLoaded', loadContacts);

async function loadContacts() {
  const res = await fetch(API);
  contacts = await res.json();
  renderTable(contacts);
}

function renderTable(data) {
  const tbody = document.querySelector('#contactsTable tbody');
  tbody.innerHTML = '';
  data.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.firstName} ${c.lastName}</td><td>${c.email}</td><td>${c.phoneNumber}</td><td>${c.category}</td>
      <td class="actions">
        <button class="edit" onclick='editContact(${JSON.stringify(c)})'>Edit</button>
        <button onclick="deleteContact(${c.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('contactId').value;
  const body = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    address: document.getElementById('address').value,
    category: document.getElementById('category').value
  };
  const url = id ? `${API}/${id}` : API;
  const method = id ? 'PUT' : 'POST';
  await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
  resetForm(); loadContacts();
});

function editContact(c) {
  document.getElementById('contactId').value = c.id;
  document.getElementById('firstName').value = c.firstName;
  document.getElementById('lastName').value = c.lastName;
  document.getElementById('email').value = c.email;
  document.getElementById('phoneNumber').value = c.phoneNumber;
  document.getElementById('address').value = c.address;
  document.getElementById('category').value = c.category;
  document.getElementById('cancelBtn').style.display = 'inline-block';
}

function resetForm() {
  document.getElementById('contactForm').reset();
  document.getElementById('contactId').value = '';
  document.getElementById('cancelBtn').style.display = 'none';
}

async function deleteContact(id) {
  if (confirm('Delete this contact?')) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadContacts();
  }
}

async function searchContacts() {
  const q = document.getElementById('searchInput').value;
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
  renderTable(await res.json());
}
