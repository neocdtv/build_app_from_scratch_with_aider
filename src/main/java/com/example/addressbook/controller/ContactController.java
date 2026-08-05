package com.example.addressbook.controller;

import com.example.addressbook.model.dto.*;
import com.example.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService service;

    public ContactController(ContactService service) { this.service = service; }

    @GetMapping
    public List<ContactDto> getAll(@RequestParam(required = false) String search, 
                                   @RequestParam(required = false) String category) {
        return service.getAllContacts(search, category);
    }

    @GetMapping("/{id}")
    public ContactDto getOne(@PathVariable Long id) { return service.getContactById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactDto create(@Valid @RequestBody ContactCreateDto dto) { return service.createContact(dto); }

    @PutMapping("/{id}")
    public ContactDto update(@PathVariable Long id, @Valid @RequestBody ContactUpdateDto dto) {
        return service.updateContact(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deleteContact(id); }
}
