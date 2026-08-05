package com.example.addressbook.controller;

import com.example.addressbook.model.dto.*;
import com.example.addressbook.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public List<ContactDto> getAll(@RequestParam(required = false) String search, 
                                   @RequestParam(required = false) String category) {
        return contactService.getAllContacts(search, category);
    }

    @GetMapping("/{id}")
    public ContactDto getOne(@PathVariable Long id) {
        return contactService.getContactById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactDto create(@Valid @RequestBody ContactCreateDto dto) {
        return contactService.createContact(dto);
    }

    @PutMapping("/{id}")
    public ContactDto update(@PathVariable Long id, @Valid @RequestBody ContactUpdateDto dto) {
        return contactService.updateContact(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        contactService.deleteContact(id);
    }
}
