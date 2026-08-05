package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactService {
    
    private final ContactRepository contactRepository;
    
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }
    
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }
    
    public Optional<Contact> updateContact(Long id, Contact contactDetails) {
        return contactRepository.findById(id).map(existingContact -> {
            existingContact.setFirstName(contactDetails.getFirstName());
            existingContact.setLastName(contactDetails.getLastName());
            existingContact.setEmail(contactDetails.getEmail());
            existingContact.setPhoneNumber(contactDetails.getPhoneNumber());
            existingContact.setAddress(contactDetails.getAddress());
            existingContact.setCategory(contactDetails.getCategory());
            return contactRepository.save(existingContact);
        });
    }
    
    public boolean deleteContact(Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional(readOnly = true)
    public List<Contact> searchContacts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return contactRepository.findAll();
        }
        String searchTerm = "%" + query.toLowerCase() + "%";
        return contactRepository.findByFirstNameContainingOrLastNameContainingOrCategoryContaining(
                searchTerm, searchTerm, searchTerm);
    }
}
