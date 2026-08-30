package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // Get all contacts
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    // Get single contact by ID
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
        
        // Split query to extract firstName, lastName, and category
        String[] parts = query.split("\\s+");
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[1] : "";
        String category = parts.length > 2 ? parts[2] : "";
        
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                firstName, lastName, category);
    }
}
