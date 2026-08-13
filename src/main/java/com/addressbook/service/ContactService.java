package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {
    private final ContactRepository repository;

    public ContactService(ContactRepository repository) { this.repository = repository; }

    public List<Contact> findAll() { return repository.findAll(); }

    public Contact findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));
    }

    public Contact save(Contact contact) { return repository.save(contact); }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) throw new EntityNotFoundException("Contact not found with id: " + id);
        repository.deleteById(id);
    }

    public List<Contact> search(String query) {
        if (query == null || query.isBlank()) return repository.findAll();
        String[] parts = query.split(" ", 2);
        String first = parts[0];
        String last = parts.length > 1 ? parts[1] : first;
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(first, last, query);
    }
}
