package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {
    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> findAll() { return repository.findAll(); }

    public Contact findById(Long id) { return repository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found")); }

    public Contact create(Contact contact) { return repository.save(contact); }

    public Contact update(Long id, Contact updatedContact) {
        Contact existing = findById(id);
        existing.setFirstName(updatedContact.getFirstName());
        existing.setLastName(updatedContact.getLastName());
        existing.setEmail(updatedContact.getEmail());
        existing.setPhoneNumber(updatedContact.getPhoneNumber());
        existing.setAddress(updatedContact.getAddress());
        existing.setCategory(updatedContact.getCategory());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new RuntimeException("Contact not found");
        repository.deleteById(id);
    }

    public List<Contact> search(String query) { return query == null || query.isBlank() ? findAll() : repository.searchContacts(query); }
}
