package com.addressbook.service;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.data.repository.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> listContacts() {
        return contactRepository.findAll();
    }

    public Contact getContact(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No contact found with id: " + id));
    }

    public List<Contact> search(String q) {
        String query = (q == null ? "" : q).trim();
        return contactRepository.searchByQuery(query);
    }

    public Contact create(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact update(Contact request) {
        Long id = request.getId();
        if (!contactRepository.existsById(id)) {
            throw new NotFoundException("No contact found with id: " + id);
        }
        return contactRepository.save(request);
    }

    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new NotFoundException("No contact found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
}
