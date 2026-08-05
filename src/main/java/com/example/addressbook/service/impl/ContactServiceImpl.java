package com.example.addressbook.service.impl;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.*;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository repository;

    public ContactServiceImpl(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ContactDto> getAllContacts(String search, String category) {
        List<Contact> contacts;
        if (search != null && !search.isEmpty()) {
            contacts = repository.searchContacts(search);
        } else if (category != null && !category.isEmpty()) {
            contacts = repository.findByCategory(category);
        } else {
            contacts = repository.findAll();
        }
        return contacts.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Long id) {
        return repository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    @Override
    public ContactDto createContact(ContactCreateDto dto) {
        Contact contact = new Contact();
        updateEntityFromDto(contact, dto);
        return mapToDto(repository.save(contact));
    }

    @Override
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        updateEntityFromDto(contact, dto);
        return mapToDto(repository.save(contact));
    }

    @Override
    public void deleteContact(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Contact not found");
        repository.deleteById(id);
    }

    private void updateEntityFromDto(Contact contact, Object dto) {
        if (dto instanceof ContactCreateDto c) {
            contact.setFirstName(c.firstName());
            contact.setLastName(c.lastName());
            contact.setEmail(c.email());
            contact.setPhoneNumber(c.phoneNumber());
            contact.setAddress(c.address());
            contact.setCategory(c.category());
        } else if (dto instanceof ContactUpdateDto u) {
            if (u.firstName() != null) contact.setFirstName(u.firstName());
            if (u.lastName() != null) contact.setLastName(u.lastName());
            if (u.email() != null) contact.setEmail(u.email());
            if (u.phoneNumber() != null) contact.setPhoneNumber(u.phoneNumber());
            if (u.address() != null) contact.setAddress(u.address());
            if (u.category() != null) contact.setCategory(u.category());
        }
    }

    private ContactDto mapToDto(Contact c) {
        return new ContactDto(c.getId(), c.getFirstName(), c.getLastName(), c.getEmail(),
                c.getPhoneNumber(), c.getAddress(), c.getCategory(), 
                c.getCreatedAt(), c.getUpdatedAt());
    }
}
