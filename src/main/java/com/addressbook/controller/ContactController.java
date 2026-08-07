package com.addressbook.controller;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/search")
    public List<Contact> searchContacts(@RequestParam String q) {
        return contactService.searchContacts(q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        Contact contact = contactService.getContactById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + id));
        return ResponseEntity.ok(contact);
    }

    @PostMapping
    public Contact createContact(@Valid @RequestBody Contact contact) {
        return contactService.createContact(contact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contactDetails) {
        if (contactDetails.getId() != null && !contactDetails.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Contact updatedContact = contactService.updateContact(id, contactDetails);
            return ResponseEntity.ok(updatedContact);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
