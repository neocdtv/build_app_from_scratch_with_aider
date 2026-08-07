const API = '/api/contacts';
document.addEventListener('DOMContentLoaded', () => { loadContacts(); document.getElementById('contactForm').addEventListener('submit', handleSubmit); });

async function loadContacts() { try { const r = await fetch(API); renderTable(await r.json()); } catch(e) { console.error(e); } }

async function searchContacts() {
    const q = document.getElementById('searchInput').value;
    if (!q) return loadContacts();
    try { const r = await fetch(`${API}/search?q=${encodeURIComponent(q)}`); renderTable(await r.json()); } catch(e) { console.error(e); }
}

function renderTable(data) {
    const tb = document.getElementById('contactTableBody'); tb.innerHTML = '';
    if (!data.length) { tb.innerHTML = '<tr><td colspan="7" style="text-align:center">No contacts found</td></tr>'; return; }
    data.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${c.id}</td><td>${esc(c.firstName)} ${esc(c.lastName)}</td><td>${esc(c.email)}</td><td>${esc(c.phoneNumber)}</td><td>${esc(c.address)}</td><td>${esc(c.category)}</td>
        <td class="actions"><button class="edit-btn" onclick="editContact(${c.id})">Edit</button><button class="delete-btn" onclick="deleteContact(${c.id})">Delete</button></td>`;
        tb.appendChild(tr);
    });
}

async function handleSubmit(e) {
    e.preventDefault(); const id = document.getElementById('contactId').value;
    const url = id ? `${API}/${id}` : API; const method = id ? 'PUT' : 'POST';
    const body = Object.fromEntries(['firstName','lastName','email','phoneNumber','address','category'].map(k => [k, document.getElementById(k).value]));
    try { const r = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }); if (r.ok || r.status === 201) { resetForm(); loadContacts(); } else alert('Save failed.'); } catch(e) { console.error(e); }
}

async function editContact(id) { try { const r = await fetch(`${API}/${id}`); const c = await r.json(); ['contactId','firstName','lastName','email','phoneNumber','address','category'].forEach(k => document.getElementById(k).value = k === 'contactId' ? c.id : c[k]); } catch(e) { console.error(e); } }

async function deleteContact(id) { if (!confirm('Delete?')) return; try { await fetch(`${API}/${id}`, { method: 'DELETE' }); loadContacts(); } catch(e) { console.error(e); } }
function resetForm() { document.getElementById('contactForm').reset(); document.getElementById('contactId').value = ''; }
function esc(t) { return t ? t.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])) : ''; }
