(function () {
    'use strict';

    const API = '/api/contacts';

    // Elements
    const form = document.getElementById('contact-form');
    const formTitle = document.getElementById('form-title');
    const cancelBtn = document.getElementById('cancel-form');
    const idInput = document.getElementById('contact-id');
    const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'category'];
    const inputs = {};
    fields.forEach((f) => (inputs[f] = document.getElementById(f)));

    const grid = document.getElementById('contacts-grid');
    const resultCount = document.getElementById('result-count');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const toast = document.getElementById('toast');

    let currentQuery = '';

    // ---------- Validation helpers ----------
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(name) {
        const el = inputs[name];
        const value = el.value.trim();
        const errorEl = document.querySelector('.error-msg[data-for="' + name + '"]');
        let message = '';

        if (name === 'email' && value.length > 0 && !emailRe.test(value)) {
            message = 'Enter a valid email address';
        } else if ((name === 'phoneNumber') && value.length > 0) {
            const digits = value.replace(/[\s\-().+]/g, '');
            // allow international leading plus; must contain at least one digit
            if (!/^\+?\d+$/.test(value) || isNaN(Number(digits)) ) {
                message = 'Phone may only include digits, spaces, dashes and +';
            }
        }

        el.classList.toggle('invalid', message !== '');
        if (errorEl) errorEl.textContent = message;
        return message === '';
    }

    function validateAll() {
        let ok = true;
        fields.forEach((f) => { if (!validateField(f)) ok = false; });
        return ok;
    }

    // ---------- Form handling ----------
    function openCreateForm() {
        form.reset();
        idInput.value = '';
        formTitle.textContent = 'Add New Contact';
        clearErrors();
    }

    function editContact(contact) {
        idInput.value = contact.id;
        inputs.firstName.value = contact.firstName || '';
        inputs.lastName.value = contact.lastName || '';
        inputs.email.value = contact.email || '';
        inputs.phoneNumber.value = contact.phoneNumber || '';
        inputs.address.value = contact.address || '';
        inputs.category.value = contact.category || '';
        formTitle.textContent = 'Edit Contact';
        clearErrors();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function clearErrors() {
        fields.forEach((f) => {
            inputs[f].classList.remove('invalid');
            const err = document.querySelector('.error-msg[data-for="' + f + '"]');
            if (err) err.textContent = '';
        });
    }

    cancelBtn.addEventListener('click', openCreateForm);

    // Live validation on blur for any changed field
    fields.forEach((f) => {
        inputs[f].addEventListener('blur', () => validateField(f));
        inputs[f].addEventListener('input', () => {
            if (inputs[f].classList.contains('invalid')) validateField(f);
        });
    });

    form.addEventListener('submit', async function (evt) {
        evt.preventDefault();
        if (!validateAll()) return;

        const payload = {};
        fields.forEach((f) => (payload[f] = inputs[f].value.trim()));

        try {
            let response;
            if (idInput.value) {
                response = await fetch(API + '/' + idInput.value, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch(API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!response.ok && !(idInput.value ? response.status === 200 : response.status === 201)) {
                throw new Error('Request failed (' + response.status + ')');
            }
            showToast(idInput.value ? 'Contact updated.' : 'Contact added.');
            openCreateForm();
            refreshList();
        } catch (err) {
            showToast('Error: ' + err.message);
        }
    });

    // ---------- Rendering ----------
    function initials(name) {
        return name.trim().split(/\s+/).map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();
    }

    function renderContacts(list) {
        grid.innerHTML = '';

        if (list.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = currentQuery ? 'No contacts match your search.' : 'No contacts yet. Add your first one above!';
            grid.appendChild(empty);
            resultCount.textContent = '0 contacts';
            return;
        }

        list.forEach((c) => {
            const card = document.createElement('section');
            card.className = 'contact-card';

            const name = document.createElement('p');
            name.className = 'name';
            name.textContent = c.firstName + ' ' + c.lastName;

            const tag = document.createElement('span');
            tag.className = 'category-tag';
            tag.textContent = c.category || '';

            const email = lineFor('Email', c.email, 'mailto:' + c.email);
            const phone = lineFor('Phone', c.phoneNumber, 'tel:' + c.phoneNumber.replace(/[^\d+]/g, ''));
            const addr = lineFor('Address', c.address);

            card.append(name, tag, email, phone, addr);

            const actions = document.createElement('div');
            actions.className = 'card-actions';

            const editBtn = btnButton('Edit', 'btn btn-ghost', () => editContact(c));
            const delBtn = btnButton('Delete', 'btn btn-danger', async () => { await deleteContact(c.id); });
            actions.append(editBtn, delBtn);
            card.appendChild(actions);

            grid.appendChild(card);
        });

        resultCount.textContent = list.length + (list.length === 1 ? ' contact' : ' contacts');
    }

    function lineFor(label, value, extra) {
        const wrap = document.createElement('p');
        wrap.className = 'line';
        if (!value) return null;
        if (extra) {
            const a = document.createElement('a');
            a.href = extra;
            a.textContent = value;
            a.style.color = '#2563eb';
            wrap.appendChild(a);
        } else {
            wrap.innerHTML = '<small>' + label + '</small> ' + escapeHtml(value);
        }
        return wrap;
    }

    function btnButton(text, cls, handler) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = cls;
        b.textContent = text;
        b.addEventListener('click', handler);
        return b;
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ---------- API calls ----------
    async function fetchContacts(query) {
        const url = query ? API + '/search?q=' + encodeURIComponent(query) : API;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Could not load contacts (' + res.status + ')');
        return res.json();
    }

    async function deleteContact(id) {
        if (!confirm('Delete this contact? This cannot be undone.')) return;
        try {
            const res = await fetch(API + '/' + id, { method: 'DELETE' });
            if (res.ok || res.status === 204) {
                showToast('Contact deleted.');
                refreshList();
            } else {
                throw new Error('Could not delete (' + res.status + ')');
            }
        } catch (err) {
            showToast(err.message);
        }
    }

    // ---------- Search ----------
    let searchTimer = null;
    function debounce(fn, ms) {
        return function () { clearTimeout(searchTimer); searchTimer = setTimeout(fn, ms); };
    }

    const onSearchChange = debounce(() => { currentQuery = searchInput.value.trim(); renderResults(); }, 250);
    searchInput.addEventListener('input', onSearchChange);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderResults();
    });
    searchInput.addEventListener('input', () => {
        clearSearchBtn.classList.toggle('hidden', searchInput.value.length === 0);
    });

    // ---------- Utils / lifecycle ----------
    let toastTimer = null;
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
    }

    async function refreshList() {
        try {
            const data = await fetchContacts(currentQuery);
            renderContacts(data);
        } catch (err) {
            renderContacts([]);
            showToast(err.message);
        }
    }

    function renderResults() {
        clearSearchBtn.classList.toggle('hidden', searchInput.value.length === 0);
        refreshList();
    }

    // Boot
    document.addEventListener('DOMContentLoaded', () => openCreateForm());
    refreshList();
})();
