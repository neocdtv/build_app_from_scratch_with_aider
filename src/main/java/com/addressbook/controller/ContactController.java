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
    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    public List<Contact> getAll() { return service.getAllContacts(); }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable Long id) { return service.getContactById(id); }

    @PostMapping
    public ResponseEntity<Contact> create(@Valid @RequestBody Contact contact) {
        return new ResponseEntity<>(service.createContact(contact), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> update(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        return ResponseEntity.ok(service.updateContact(id, contact));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam String q) {
        return service.searchContacts(q);
    }
}
