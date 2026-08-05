package com.example.addressbook.controller;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

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
        ContactDto created = contactService.create(dto);
        return ResponseEntity.created(URI.create("/api/contacts/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(@PathVariable Long id,
                                             @Valid @RequestBody ContactUpdateDto dto) {
        return ResponseEntity.ok(contactService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
