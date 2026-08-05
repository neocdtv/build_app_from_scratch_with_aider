package com.example.addressbook.service.impl;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    @Override
    public List<ContactDto> getAll(String search, String category) {
        List<Contact> contacts;
        if (search != null && !search.isEmpty()) {
            contacts = contactRepository.findAllBySearchPattern(search);
        } else if (category != null && !category.isEmpty()) {
            contacts = contactRepository.findByCategory(category);
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
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with ID: " + id));
        return toDto(contact);
    }

    @Override
    @Transactional
    public ContactDto create(ContactCreateDto dto) {
        Contact contact = Contact.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .category(dto.getCategory())
                .build();
        Contact saved = contactRepository.save(contact);
        return toDto(saved);
    }

    @Override
    @Transactional
    public ContactDto update(Long id, ContactUpdateDto dto) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with ID: " + id));
        if (dto.getFirstName() != null && !dto.getFirstName().isEmpty()) {
            existing.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null && !dto.getLastName().isEmpty()) {
            existing.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            existing.setEmail(dto.getEmail());
        }
        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isEmpty()) {
            existing.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getAddress() != null && !dto.getAddress().isEmpty()) {
            existing.setAddress(dto.getAddress());
        }
        if (dto.getCategory() != null && !dto.getCategory().isEmpty()) {
            existing.setCategory(dto.getCategory());
        }
        Contact updated = contactRepository.save(existing);
        return toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with ID: " + id);
        }
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
