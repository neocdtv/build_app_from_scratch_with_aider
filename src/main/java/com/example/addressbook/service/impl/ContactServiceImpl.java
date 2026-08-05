package com.example.addressbook.service.impl;

import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }

    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public List<Contact> searchContacts(String query) {
        if (query == null || query.isEmpty()) {
            return contactRepository.findAll();
        }
        return contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }

    @Override
    public Contact updateContact(Long id, Contact details) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));

        if (details.getFirstName() != null) existing.setFirstName(details.getFirstName());
        if (details.getLastName() != null) existing.setLastName(details.getLastName());
        if (details.getEmail() != null) existing.setEmail(details.getEmail());
        if (details.getPhoneNumber() != null) existing.setPhoneNumber(details.getPhoneNumber());
        if (details.getAddress() != null) existing.setAddress(details.getAddress());
        if (details.getCategory() != null) existing.setCategory(details.getCategory());

        return contactRepository.save(existing);
    }

    @Override
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new EntityNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
}
