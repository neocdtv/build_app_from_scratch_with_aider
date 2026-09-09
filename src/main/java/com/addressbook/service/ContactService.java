package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.domain.Specification;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public java.util.List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));
    }

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long id, Contact contactDetails) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));

        existingContact.setMyName(contactDetails.getMyName());
        existingContact.setLastName(contactDetails.getLastName());
        existingContact.setEmail(contactDetails.getEmail());
        existingContact.setPhoneNumber(contactDetails.getPhoneNumber());
        existingContact.setAddress(contactDetails.getAddress());
        existingContact.setCategory(contactDetails.getCategory());

        return contactRepository.save(existingContact);
    }

    public void deleteContact(Long id) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));

        contactRepository.delete(existingContact);
    }

    public java.util.List<Contact> searchContacts(String query) {
        if (query == null || query.isBlank()) {
            return contactRepository.findAll();
        }

        Specification<Contact> spec = (root, queryCriteriaBuilder, criteriaBuilder) -> {
            String queryLower = query.toLowerCase();
            String pattern = "%" + queryLower + "%";
            
            return queryCriteriaBuilder.or(
                queryCriteriaBuilder.like(
                    criteriaBuilder.lower(root.get("myName")),
                    pattern
                ),
                queryCriteriaBuilder.like(
                    criteriaBuilder.lower(root.get("category")),
                    pattern
                )
            );
        };

        return contactRepository.findAll(spec);
    }
}
