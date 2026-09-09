package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Contact findById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));
    }

    @Transactional
    public Contact create(Contact contact) {
        return contactRepository.save(contact);
    }

    @Transactional
    public Contact update(Long id, Contact updated) {
        Contact existing = findById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setAddress(updated.getAddress());
        existing.setCategory(updated.getCategory());
        return contactRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        contactRepository.delete(findById(id));
    }

    @Transactional(readOnly = true)
    public List<Contact> search(String query) {
        String trimmed = (query == null) ? "" : query.trim();
        if (trimmed.isEmpty()) {
            return findAll();
        }
        return contactRepository.search(trimmed);
    }
}
