package com.example.addressbook.service;

import com.example.addressbook.model.entity.Contact;
import java.util.List;
import java.util.Optional;

public interface ContactService {
    Contact createContact(Contact contact);
    Optional<Contact> getContactById(Long id);
    List<Contact> getAllContacts();
    List<Contact> searchContacts(String query);
    Contact updateContact(Long id, Contact contactDetails);
    void deleteContact(Long id);
}
