document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const contact = {
        id: parseInt(document.getElementById("contactId").value),
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        category: document.getElementById("category").value
    };

    if (contact.id) {
        updateContact(contact);
    } else {
        createContact(contact);
    }
});

function createContact(contact) {
    fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                renderContact(data);
                resetForm();
            });
        }
    });
}

function updateContact(contact) {
    fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    }).then(response => {
        if (response.ok) {
            renderContact(contact);
            resetForm();
        }
    });
}

function deleteContact(id) {
    fetch(`/api/contacts/${id}`, { method: "DELETE" }).then(() => {
        renderContacts();
    });
}

function renderContacts() {
    fetch("/api/contacts").then(response => response.json()).then(contacts => {
        const tbody = document.querySelector("#contactTable tbody");
        tbody.innerHTML = contacts.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.address}</td>
                <td>${c.category}</td>
                <td>
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    });
}

function editContact(id) {
    fetch(`/api/contacts/${id}`).then(response => response.json()).then(contact => {
        document.getElementById("contactId").value = contact.id;
        document.getElementById("firstName").value = contact.firstName;
        document.getElementById("lastName").value = contact.lastName;
        document.getElementById("email").value = contact.email;
        document.getElementById("phone").value = contact.phoneNumber;
        document.getElementById("address").value = contact.address;
        document.getElementById("category").value = contact.category;
    });
}

function resetForm() {
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = "";
}

function searchContacts() {
    const query = document.getElementById("search").value;
    fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`).then(response => response.json()).then(contacts => {
        const tbody = document.querySelector("#contactTable tbody");
        tbody.innerHTML = contacts.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.address}</td>
                <td>${c.category}</td>
                <td>
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    });
}

renderContacts();
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const contact = {
        id: parseInt(document.getElementById("contactId").value),
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        category: document.getElementById("category").value
    };

    if (contact.id) {
        updateContact(contact);
    } else {
        createContact(contact);
    }
});

function createContact(contact) {
    fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                renderContact(data);
                resetForm();
            });
        }
    });
}

function updateContact(contact) {
    fetch(`/api/contacts/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
    }).then(response => {
        if (response.ok) {
            renderContact(contact);
            resetForm();
        }
    });
}

function deleteContact(id) {
    fetch(`/api/contacts/${id}`, { method: "DELETE" }).then(() => {
        renderContacts();
    });
}

function renderContacts() {
    fetch("/api/contacts").then(response => response.json()).then(contacts => {
        const tbody = document.querySelector("#contactTable tbody");
        tbody.innerHTML = contacts.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.address}</td>
                <td>${c.category}</td>
                <td>
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    });
}

function editContact(id) {
    fetch(`/api/contacts/${id}`).then(response => response.json()).then(contact => {
        document.getElementById("contactId").value = contact.id;
        document.getElementById("firstName").value = contact.firstName;
        document.getElementById("lastName").value = contact.lastName;
        document.getElementById("email").value = contact.email;
        document.getElementById("phone").value = contact.phoneNumber;
        document.getElementById("address").value = contact.address;
        document.getElementById("category").value = contact.category;
    });
}

function resetForm() {
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = "";
}

function searchContacts() {
    const query = document.getElementById("search").value;
    fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`).then(response => response.json()).then(contacts => {
        const tbody = document.querySelector("#contactTable tbody");
        tbody.innerHTML = contacts.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.firstName}</td>
                <td>${c.lastName}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>${c.address}</td>
                <td>${c.category}</td>
                <td>
                    <button onclick="editContact(${c.id})">Edit</button>
                    <button onclick="deleteContact(${c.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    });
}

renderContacts();
