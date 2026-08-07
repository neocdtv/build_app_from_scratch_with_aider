package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Contact> findById(Long id) {
        return contactRepository.findById(id);
    }

    @Transactional
    public Contact save(Contact contact) {
        return contactRepository.save(contact);
    }

    @Transactional
    public void deleteById(Long id) {
        contactRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Contact> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        String lowerQuery = query.toLowerCase();
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                lowerQuery, lowerQuery, lowerQuery);
    }
}
