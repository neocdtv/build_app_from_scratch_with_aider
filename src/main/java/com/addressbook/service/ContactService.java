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

    public Contact findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Contact save(Contact contact) { return repository.save(contact); }

    public void deleteById(Long id) { repository.deleteById(id); }

    public List<Contact> search(String query) {
        if (query == null || query.trim().isEmpty()) return findAll();
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }
}
