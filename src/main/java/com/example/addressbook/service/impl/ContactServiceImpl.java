package com.example.addressbook.service.impl;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {
    
    private final ContactRepository contactRepository;
    
    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ContactDto> findAll(String search, String category) {
        if (search != null && !search.isEmpty()) {
            return contactRepository.findByFirstNameOrLastNameOrCategoryContainingIgnoreCase(search)
                    .stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } else if (category != null && !category.isEmpty()) {
            return contactRepository.findByCategory(category)
                    .stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
        return contactRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ContactDto findById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return mapToDto(contact);
    }
    
    @Override
    @Transactional
    public ContactDto create(ContactCreateDto dto) {
        Contact contact = mapToEntity(dto);
        contact.setCreatedAt(java.time.LocalDateTime.now());
        contact.setUpdatedAt(java.time.LocalDateTime.now());
        Contact saved = contactRepository.save(contact);
        return mapToDto(saved);
    }
    
    @Override
    @Transactional
    public ContactDto update(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        
        if (dto.getFirstName() != null) {
            contact.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            contact.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null) {
            contact.setEmail(dto.getEmail());
        }
        if (dto.getPhoneNumber() != null) {
            contact.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getAddress() != null) {
            contact.setAddress(dto.getAddress());
        }
        if (dto.getCategory() != null) {
            contact.setCategory(dto.getCategory());
        }
        
        contact.setUpdatedAt(java.time.LocalDateTime.now());
        Contact updated = contactRepository.save(contact);
        return mapToDto(updated);
    }
    
    @Override
    @Transactional
    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
    
    private ContactDto mapToDto(Contact contact) {
        ContactDto dto = new ContactDto();
        dto.setId(contact.getId());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setEmail(contact.getEmail());
        dto.setPhoneNumber(contact.getPhoneNumber());
        dto.setAddress(contact.getAddress());
        dto.setCategory(contact.getCategory());
        dto.setCreatedAt(contact.getCreatedAt());
        dto.setUpdatedAt(contact.getUpdatedAt());
        return dto;
    }
    
    private Contact mapToEntity(ContactCreateDto dto) {
        Contact contact = new Contact();
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setEmail(dto.getEmail());
        contact.setPhoneNumber(dto.getPhoneNumber());
        contact.setAddress(dto.getAddress());
        contact.setCategory(dto.getCategory());
        return contact;
    }
}
