package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ContactService {
    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> findAll() {
        return repository.findAll();
    }

    public Contact findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Contact not found with id: " + id));
    }

    public Contact save(Contact contact) {
        return repository.save(contact);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Contact not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<Contact> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        String q = query.toLowerCase();
        List<Contact> byName = repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(q, q);
        List<Contact> byCategory = repository.findByCategoryContainingIgnoreCase(q);
        
        // Merge and deduplicate
        List<Contact> merged = new java.util.ArrayList<>(byName);
        for (Contact c : byCategory) {
            if (merged.stream().noneMatch(existing -> existing.getId().equals(c.getId()))) {
                merged.add(c);
            }
        }
        return merged;
    }
}
