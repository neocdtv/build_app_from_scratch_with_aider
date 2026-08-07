package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {
    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> getAllContacts() { return repository.findAll(); }
    
    public Contact getContactById(Long id) { 
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found")); 
    }

    public Contact createContact(Contact contact) { return repository.save(contact); }

    public Contact updateContact(Long id, Contact details) {
        Contact contact = getContactById(id);
        contact.setFirstName(details.getFirstName());
        contact.setLastName(details.getLastName());
        contact.setEmail(details.getEmail());
        contact.setPhoneNumber(details.getPhoneNumber());
        contact.setAddress(details.getAddress());
        contact.setCategory(details.getCategory());
        return repository.save(contact);
    }

    public void deleteContact(Long id) { repository.deleteById(id); }

    public List<Contact> searchContacts(String query) { return repository.search(query); }
}
