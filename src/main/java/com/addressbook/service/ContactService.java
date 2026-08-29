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
    
    // Get all contacts
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    // Get single contact by ID (throw exception if not found)
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with ID: " + id));
    }
    
    // Create new contact
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }
    
    // Update existing contact
    public Contact updateContact(Long id, Contact updatedContact) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with ID: " + id));
        
        existingContact.setFirstName(updatedContact.getFirstName());
        existingContact.setLastName(updatedContact.getLastName());
        existingContact.setEmail(updatedContact.getEmail());
        existingContact.setPhoneNumber(updatedContact.getPhoneNumber());
        existingContact.setAddress(updatedContact.getAddress());
        existingContact.setCategory(updatedContact.getCategory());
        
        return contactRepository.save(existingContact);
    }
    
    // Delete contact by ID
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }
    
    // Search contacts by query string (name or category)
    public List<Contact> searchContacts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return contactRepository.findAll();
        }
        
        String firstName = query;
        String lastName = query;
        String category = query;
        
        return contactRepository.searchByNameOrCategory(firstName, lastName, category);
    }
}
