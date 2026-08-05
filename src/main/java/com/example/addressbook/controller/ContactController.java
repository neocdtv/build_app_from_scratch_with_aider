package com.example.addressbook.controller;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    
    private final ContactService contactService;
    
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }
    
    @GetMapping
    public ResponseEntity<List<ContactDto>> getAllContacts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<ContactDto> contacts = contactService.getAllContacts(search, category);
        return ResponseEntity.ok(contacts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContactById(@PathVariable Long id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ContactDto> createContact(@Valid @RequestBody ContactCreateDto contactDto) {
        ContactDto createdContact = contactService.createContact(contactDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> updateContact(@PathVariable Long id, 
                                                    @Valid @RequestBody ContactUpdateDto contactDto) {
        try {
            ContactDto updatedContact = contactService.updateContact(id, contactDto);
            return ResponseEntity.ok(updatedContact);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
