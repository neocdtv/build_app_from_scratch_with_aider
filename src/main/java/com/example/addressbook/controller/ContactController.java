package com.example.addressbook.controller;

import com.example.addressbook.model.dto.*;
import com.example.addressbook.service.ContactService;
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
    public ResponseEntity<List<ContactDto>> getAll(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category) {
        return ResponseEntity.ok(contactService.getAll(search, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ContactDto> create(@Valid @RequestBody ContactCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(@PathVariable Long id, @Valid @RequestBody ContactUpdateDto dto) {
        return ResponseEntity.ok(contactService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
