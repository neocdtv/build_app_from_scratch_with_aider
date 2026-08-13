package com.addressbook.controller;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    public List<Contact> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Contact> create(@Valid @RequestBody Contact contact) {
        Contact saved = service.save(contact);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        service.findById(id); // verify existence
        contact.setId(id);
        return service.save(contact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam String q) {
        return service.search(q);
    }
}
