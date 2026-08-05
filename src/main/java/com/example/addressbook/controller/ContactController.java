package com.example.addressbook.controller;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.*;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    private ContactDto mapToDto(Contact contact) {
        return ContactDto.builder()
                .id(contact.getId())
                .firstName(contact.getFirstName())
                .lastName(contact.getLastName())
                .email(contact.getEmail())
                .phoneNumber(contact.getPhoneNumber())
                .address(contact.getAddress())
                .category(contact.getCategory())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }

    private Contact mapToEntity(ContactCreateDto dto) {
        return Contact.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .category(dto.getCategory())
                .build();
    }

    @GetMapping
    public ResponseEntity<List<ContactDto>> getAllContacts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<Contact> contacts;
        if (search != null || category != null) {
            // Note: The current service implementation combines them or uses search. 
            // For simplicity in this refactor, we use the existing search logic.
            contacts = contactService.searchContacts(search != null ? search : category);
        } else {
            contacts = contactService.getAllContacts();
        }
        return ResponseEntity.ok(contacts.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContactById(@PathVariable Long id) {
        Contact contact = contactService.getContactById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return ResponseEntity.ok(mapToDto(contact));
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@Valid @RequestBody ContactCreateDto createDto) {
        Contact contact = contactService.createContact(mapToEntity(createDto));
        return new ResponseEntity<>(mapToDto(contact), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> updateContact(@PathVariable Long id, @Valid @RequestBody ContactUpdateDto updateDto) {
        Contact existing = contactService.getContactById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        // Map DTO updates to Entity
        if (updateDto.getFirstName() != null) existing.setFirstName(updateDto.getFirstName());
        if (updateDto.getLastName() != null) existing.setLastName(updateDto.getLastName());
        if (updateDto.getEmail() != null) existing.setEmail(updateDto.getEmail());
        if (updateDto.getPhoneNumber() != null) existing.setPhoneNumber(updateDto.getPhoneNumber());
        if (updateDto.getAddress() != null) existing.setAddress(updateDto.getAddress());
        if (updateDto.getCategory() != null) existing.setCategory(updateDto.getCategory());

        Contact updated = contactService.updateContact(id, existing);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
