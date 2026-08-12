package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> findAll() { return repository.findAll(); }
    public Optional<Contact> findById(Long id) { return repository.findById(id); }
    public Contact create(Contact contact) { return repository.save(contact); }
    public Contact update(Long id, Contact contactDetails) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        contact.setFirstName(contactDetails.getFirstName());
        contact.setLastName(contactDetails.getLastName());
        contact.setEmail(contactDetails.getEmail());
        contact.setPhoneNumber(contactDetails.getPhoneNumber());
        contact.setAddress(contactDetails.getAddress());
        contact.setCategory(contactDetails.getCategory());
        return repository.save(contact);
    }
    public void delete(Long id) { repository.deleteById(id); }
    public List<Contact> search(String query) {
        if (query == null || query.isBlank()) return findAll();
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }
}
