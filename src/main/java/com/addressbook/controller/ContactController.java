package com.addressbook.controller;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public List<Contact> list() {
        return contactService.listContacts();
    }

    @GetMapping("/{id}")
    public Contact get(@PathVariable Long id) {
        return contactService.getContact(id);
    }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam(defaultValue = "") String q) {
        return contactService.search(q);
    }

    @PostMapping
    public ResponseEntity<Contact> create(@Valid @RequestBody Contact contact) {
        Contact saved = contactService.create(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable Long id, @Valid @RequestBody Contact request) {
        request.setId(id);
        return contactService.update(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
