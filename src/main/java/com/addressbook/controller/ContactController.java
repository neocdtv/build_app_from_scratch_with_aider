package com.addressbook.controller;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody Contact contact) {
        Contact createdContact = contactService.createContact(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody Contact contact) {
        return contactService.updateContact(id, contact)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (contactService.deleteContact(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public List<Contact> searchContacts(@RequestParam("q") String query) {
        return contactService.searchContacts(query);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Void> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.notFound().build();
    }
}
