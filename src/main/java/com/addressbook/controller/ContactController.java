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
    public ContactController(ContactService contactService) { this.contactService = contactService; }

    @GetMapping
    public ResponseEntity<List<Contact>> getAll() { return ResponseEntity.ok(contactService.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.findById(id).orElseThrow(() -> new RuntimeException("Contact not found: " + id)));
    }

    @PostMapping
    public ResponseEntity<Contact> create(@Valid @RequestBody Contact contact) {
        return new ResponseEntity<>(contactService.create(contact), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> update(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        return ResponseEntity.ok(contactService.update(id, contact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { contactService.deleteById(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/search")
    public ResponseEntity<List<Contact>> search(@RequestParam String q) {
        return ResponseEntity.ok(contactService.search(q));
    }
}
