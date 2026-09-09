package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // Get all contacts
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    // Get single contact by ID (throw an exception if not found)
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with ID: " + id));
    }

    // Create new contact
    @Transactional
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    // Update existing contact
    @Transactional
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
    @Transactional
    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    // Search contacts by query string (name or category)
    public List<Contact> searchContacts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return contactRepository.findAll();
        }
        
        // Split query by space to search multiple fields
        String[] parts = query.trim().split("\\s+");
        String firstName = parts[0];
        
        // Search firstName
        List<Contact> results = contactRepository.findByFirstNameContainingIgnoreCase(firstName);
        
        // If query has more parts, check category
        if (parts.length > 1) {
            String category = parts[1];
            List<Contact> categoryResults = contactRepository.findByCategoryContainingIgnoreCase(category);
            results.addAll(categoryResults);
        }
        
        // Also check last name and category if in query
        if (parts.length > 1) {
            String lastName = parts[1];
            List<Contact> lastNameResults = contactRepository.findByLastNameContainingIgnoreCase(lastName);
            results.addAll(lastNameResults);
        }
        
        return results;
    }
}
