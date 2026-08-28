package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContactService {
    
    private final ContactRepository contactRepository;
    
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
    }
    
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }
    
    public Contact updateContact(Contact contact) {
        if (contact.getId() == null) {
            throw new RuntimeException("Contact ID is required for update");
        }
        return contactRepository.save(contact);
    }
    
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Contact> searchContacts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return contactRepository.findAll();
        }
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }
}
