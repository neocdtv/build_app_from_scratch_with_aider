package com.example.addressbook.service.impl;

import com.example.addressbook.model.dto.*;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<ContactDto> getAll(String search, String category) {
        List<Contact> contacts;
        if (search != null && !search.isEmpty()) {
            contacts = contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                search, search, search);
        } else if (category != null && !category.isEmpty()) {
            contacts = contactRepository.findAll().stream()
                .filter(c -> category.equals(c.getCategory()))
                .collect(Collectors.toList());
        } else {
            contacts = contactRepository.findAll();
        }
        return contacts.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public ContactDto getById(Long id) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found"));
        return toDto(contact);
    }

    @Override
    public ContactDto create(ContactCreateDto dto) {
        Contact contact = Contact.builder()
            .firstName(dto.getFirstName())
            .lastName(dto.getLastName())
            .email(dto.getEmail())
            .phoneNumber(dto.getPhoneNumber())
            .address(dto.getAddress())
            .category(dto.getCategory())
            .build();
        contact = contactRepository.save(contact);
        return toDto(contact);
    }

    @Override
    public ContactDto update(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found"));
        if (dto.getFirstName() != null) contact.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) contact.setLastName(dto.getLastName());
        if (dto.getEmail() != null) contact.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) contact.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAddress() != null) contact.setAddress(dto.getAddress());
        if (dto.getCategory() != null) contact.setCategory(dto.getCategory());
        contact = contactRepository.save(contact);
        return toDto(contact);
    }

    @Override
    public void delete(Long id) {
        contactRepository.deleteById(id);
    }

    private ContactDto toDto(Contact contact) {
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
}
