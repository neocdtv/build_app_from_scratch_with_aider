package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    public Optional<Contact> findById(Long id) {
        return contactRepository.findById(id);
    }

    public Contact create(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact update(Long id, Contact contact) {
        if (contact.getId() != null && !contact.getId().equals(id)) {
            throw new IllegalArgumentException("ID mismatch");
        }
        contact.setId(id);
        return contactRepository.save(contact);
    }

    public void delete(Long id) {
        contactRepository.deleteById(id);
    }

    public List<Contact> searchByQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        
        String nameQuery = query;
        if (query.contains(" ")) {
            nameQuery = query.substring(0, query.indexOf(" "));
        }
        
        List<Contact> byName = contactRepository.findByFirstNameOrLastNameContainingIgnoreCase(nameQuery);
        List<Contact> byCategory = contactRepository.findByCategory(query);
        
        Set<Contact> combined = new HashSet<>(byName);
        combined.addAll(byCategory);
        return new ArrayList<>(combined);
    }
}
