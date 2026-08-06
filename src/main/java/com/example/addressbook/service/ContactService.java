package com.example.addressbook.service;

import com.example.addressbook.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
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
    public Contact save(Contact contact) { return repository.save(contact); }
    public void deleteById(Long id) { repository.deleteById(id); }
    public List<Contact> search(String query) {
        if (query == null || query.isBlank()) return findAll();
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }
}
