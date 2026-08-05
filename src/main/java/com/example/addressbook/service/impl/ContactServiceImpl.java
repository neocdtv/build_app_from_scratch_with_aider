package com.example.addressbook.service.impl;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.*;
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

    private final ContactRepository repository;

    @Override
    public List<ContactDto> getAllContacts(String search, String category) {
        return repository.searchContacts(search, category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Long id) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return convertToDto(contact);
    }

    @Override
    @Transactional
    public ContactDto createContact(ContactCreateDto dto) {
        Contact contact = new Contact();
        mapDtoToEntity(dto, contact);
        return convertToDto(repository.save(contact));
    }

    @Override
    @Transactional
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        
        if (dto.getFirstName() != null) contact.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) contact.setLastName(dto.getLastName());
        if (dto.getAddress() != null) contact.setAddress(dto.getAddress());
        if (dto.getCategory() != null) contact.setCategory(dto.getCategory());
        
        return convertToDto(repository.save(contact));
    }

    @Override
    @Transactional
    public void deleteContact(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void mapDtoToEntity(ContactCreateDto dto, Contact contact) {
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setEmail(dto.getEmail());
        contact.setPhoneNumber(dto.getPhoneNumber());
        contact.setAddress(dto.getAddress());
        contact.setCategory(dto.getCategory());
    }

    private ContactDto convertToDto(Contact contact) {
        ContactDto dto = new ContactDto();
        dto.setId(contact.getId());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setEmail(contact.getEmail());
        dto.setPhoneNumber(contact.getPhoneNumber());
        dto.setAddress(contact.getAddress());
        dto.setCategory(contact.getCategory());
        dto.setCreatedAt(contact.getCreatedAt());
        return dto;
    }
}
