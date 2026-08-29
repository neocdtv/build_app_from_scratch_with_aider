package com.addressbook.controller;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    
    private final ContactService contactService;
    
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }
    
    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }
    
    @GetMapping("/{id}")
    public Contact getContactById(@PathVariable Long id) {
        return contactService.getContactById(id);
    }
    
    @PostMapping
    public Contact createContact(@Valid @RequestBody Contact contact) {
        return contactService.createContact(contact);
    }
    
    @PutMapping("/{id}")
    public Contact updateContact(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        return contactService.updateContact(id, contact);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public List<Contact> searchContacts(@RequestParam String query) {
        return contactService.searchContacts(query);
    }
}
