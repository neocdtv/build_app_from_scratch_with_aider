package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) { this.contactRepository = contactRepository; }

    public List<Contact> findAll() { return contactRepository.findAll(); }
    public Optional<Contact> findById(Long id) { return contactRepository.findById(id); }

    public Contact create(Contact contact) { return contactRepository.save(contact); }

    public Contact update(Long id, Contact updated) {
        Contact existing = contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found: " + id));
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setAddress(updated.getAddress());
        existing.setCategory(updated.getCategory());
        return contactRepository.save(existing);
    }

    public void deleteById(Long id) {
        if (!contactRepository.existsById(id)) throw new RuntimeException("Contact not found: " + id);
        contactRepository.deleteById(id);
    }

    public List<Contact> search(String query) {
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }
}
