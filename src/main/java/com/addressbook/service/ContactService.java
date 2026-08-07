package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContactById(Long id) {
        return contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long id, Contact contactDetails) {
        Contact contact = getContactById(id);
        contact.setFirstName(contactDetails.getFirstName());
        contact.setLastName(contactDetails.getLastName());
        contact.setEmail(contactDetails.getEmail());
        contact.setPhoneNumber(contactDetails.getPhoneNumber());
        contact.setAddress(contactDetails.getAddress());
        contact.setCategory(contactDetails.getCategory());
        return contactRepository.save(contact);
    }

    public void deleteContact(Long id) {
        Contact contact = getContactById(id);
        contactRepository.delete(contact);
    }

    public List<Contact> searchContacts(String query) {
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }
}
