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

    public List<Contact> findAll() {
        return repository.findAll();
    }

    public Optional<Contact> findById(Long id) {
        return repository.findById(id);
    }

    public Contact save(Contact contact) {
        return repository.save(contact);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Contact not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<Contact> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        String lowerQ = query.toLowerCase();
        return repository.findAll().stream()
                .filter(c -> c.getFirstName().toLowerCase().contains(lowerQ) ||
                             c.getLastName().toLowerCase().contains(lowerQ) ||
                             c.getCategory().toLowerCase().contains(lowerQ))
                .toList();
    }
}
