package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    
    private final ContactRepository contactRepository;
    
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
    }
    
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }
    
    public Contact updateContact(Long id, Contact contact) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        
        existingContact.setFirstName(contact.getFirstName());
        existingContact.setLastName(contact.getLastName());
        existingContact.setEmail(contact.getEmail());
        existingContact.setPhoneNumber(contact.getPhoneNumber());
        existingContact.setAddress(contact.getAddress());
        existingContact.setCategory(contact.getCategory());
        
        return contactRepository.save(existingContact);
    }
    
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
    
    public List<Contact> searchContacts(String query) {
        if (query == null || query.isEmpty()) {
            return contactRepository.findAll();
        }
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }
}
