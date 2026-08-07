package com.addressbook.service;

import com.addressbook.exception.ResourceNotFoundException;
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

    public List<Contact> getAllContacts() { return repository.findAll(); }

    public Contact getContactById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact not found with ID: " + id));
    }

    public Contact createContact(Contact contact) { return repository.save(contact); }

    public Contact updateContact(Long id, Contact updatedContact) {
        Contact existing = getContactById(id);
        existing.setFirstName(updatedContact.getFirstName());
        existing.setLastName(updatedContact.getLastName());
        existing.setEmail(updatedContact.getEmail());
        existing.setPhoneNumber(updatedContact.getPhoneNumber());
        existing.setAddress(updatedContact.getAddress());
        existing.setCategory(updatedContact.getCategory());
        return repository.save(existing);
    }

    public void deleteContact(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Contact not found with ID: " + id);
        repository.deleteById(id);
    }

    public List<Contact> searchContacts(String query) { return repository.search(query); }
}
