package com.addressbook.controller;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<Contact> contacts;
        if (search != null && !search.trim().isEmpty()) {
            contacts = contactService.searchContacts(search);
        } else if (category != null && !category.trim().isEmpty()) {
            contacts = contactService.filterByCategory(category);
        } else {
            contacts = contactService.getAllContacts();
        }
        return ResponseEntity.ok(contacts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        try {
            Contact newContact = contactService.createContact(contact);
            return ResponseEntity.status(HttpStatus.CREATED).body(newContact);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        try {
            Contact updatedContact = contactService.updateContact(id, contact);
            return ResponseEntity.ok(updatedContact);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
