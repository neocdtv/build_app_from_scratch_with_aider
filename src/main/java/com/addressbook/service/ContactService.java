package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long id, Contact contactDetails) {
        Optional<Contact> existingContact = contactRepository.findById(id);
        if (existingContact.isPresent()) {
            Contact updatedContact = existingContact.get();
            updatedContact.setFirstName(contactDetails.getFirstName());
            updatedContact.setLastName(contactDetails.getLastName());
            updatedContact.setEmail(contactDetails.getEmail());
            updatedContact.setPhoneNumber(contactDetails.getPhoneNumber());
            updatedContact.setAddress(contactDetails.getAddress());
            updatedContact.setCategory(contactDetails.getCategory());
            return contactRepository.save(updatedContact);
        } else {
            throw new RuntimeException("Contact not found with ID: " + id);
        }
    }

    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    public List<Contact> searchContacts(String query) {
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }
}
