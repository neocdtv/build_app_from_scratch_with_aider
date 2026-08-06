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

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long id, Contact contact) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        existing.setFirstName(contact.getFirstName());
        existing.setLastName(contact.getLastName());
        existing.setEmail(contact.getEmail());
        existing.setPhoneNumber(contact.getPhoneNumber());
        existing.setAddress(contact.getAddress());
        existing.setCategory(contact.getCategory());
        return contactRepository.save(existing);
    }

    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    public List<Contact> searchContacts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return contactRepository.findAll();
        }
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }
}
