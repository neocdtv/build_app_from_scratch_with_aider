package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }

    public Contact getContactByIdOrThrow(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
    }

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long id, Contact contactDetails) {
        Optional<Contact> existingContact = contactRepository.findById(id);
        
        if (!existingContact.isPresent()) {
            throw new RuntimeException("Contact not found with id: " + id);
        }
        
        Contact existing = existingContact.get();
        existing.setFirstName(contactDetails.getFirstName());
        existing.setLastName(contactDetails.getLastName());
        existing.setEmail(contactDetails.getEmail());
        existing.setPhoneNumber(contactDetails.getPhoneNumber());
        existing.setAddress(contactDetails.getAddress());
        existing.setCategory(contactDetails.getCategory());
        
        return contactRepository.save(existing);
    }

    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    public List<Contact> searchContacts(String query) {
        if (query == null || query.isEmpty()) {
            return contactRepository.findAll();
        }
        
        Contact result = contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            query, query, query);
        
        List<Contact> contacts = contactRepository.findAll();
        return contacts.stream()
                .filter(c -> c.getFirstName().equalsIgnoreCase(query) ||
                           c.getLastName().equalsIgnoreCase(query) ||
                           c.getCategory().equalsIgnoreCase(query) ||
                           c.getEmail().contains(query) ||
                           c.getPhoneNumber().contains(query))
                .toList();
    }
}
