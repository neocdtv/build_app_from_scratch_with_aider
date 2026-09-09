package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Transactional
    public Contact updateContact(Long id, Contact updatedDetails) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact with ID " + id + " not found"));
        
        if (updatedDetails.getFirstName() != null && !updatedDetails.getFirstName().isBlank()) {
            existingContact.setFirstName(updatedDetails.getFirstName());
        }
        if (updatedDetails.getLastName() != null && !updatedDetails.getLastName().isBlank()) {
            existingContact.setLastName(updatedDetails.getLastName());
        }
        if (updatedDetails.getEmail() != null && !updatedDetails.getEmail().isBlank()) {
            existingContact.setEmail(updatedDetails.getEmail());
        }
        if (updatedDetails.getPhoneNumber() != null && !updatedDetails.getPhoneNumber().isBlank()) {
            existingContact.setPhoneNumber(updatedDetails.getPhoneNumber());
        }
        if (updatedDetails.getAddress() != null && !updatedDetails.getAddress().isBlank()) {
            existingContact.setAddress(updatedDetails.getAddress());
        }
        if (updatedDetails.getCategory() != null && !updatedDetails.getCategory().isBlank()) {
            existingContact.setCategory(updatedDetails.getCategory());
        }

        return contactRepository.save(existingContact);
    }

    @Transactional
    public void deleteContact(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact with ID " + id + " not found"));
        contactRepository.delete(contact);
    }

    public List<Contact> searchContacts(String keyword) {
        String normalizedKeyword = "%" + keyword.toLowerCase() + "%";
        return contactRepository.findByKeyword(normalizedKeyword);
    }
}
