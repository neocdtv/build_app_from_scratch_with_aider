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

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<ContactDto> getAllContacts(String search, String category) {
        List<Contact> contacts;
        if (search != null && !search.isEmpty()) {
            contacts = contactRepository.searchContacts(search);
        } else if (category != null && !category.isEmpty()) {
            contacts = contactRepository.findByCategory(category);
        } else {
            contacts = contactRepository.findAll();
        }
        return contacts.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return convertToDto(contact);
    }

    @Override
    public ContactDto createContact(ContactCreateDto dto) {
        Contact contact = new Contact(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail(),
                dto.getPhoneNumber(),
                dto.getAddress(),
                dto.getCategory()
        );
        Contact saved = contactRepository.save(contact);
        return convertToDto(saved);
    }

    @Override
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        if (dto.getFirstName() != null) contact.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) contact.setLastName(dto.getLastName());
        if (dto.getEmail() != null) contact.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) contact.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAddress() != null) contact.setAddress(dto.getAddress());
        if (dto.getCategory() != null) contact.setCategory(dto.getCategory());

        Contact updated = contactRepository.save(contact);
        return convertToDto(updated);
    }

    @Override
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
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
        dto.setCreatedAt(contact.getgetCreatedAt());
        dto.setUpdatedAt(contact.getUpdatedAt());
        return dto;
    }
}
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

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<ContactDto> getAllContacts(String search, String category) {
        List<Contact> contacts;
        if (search != null && !search.isEmpty()) {
            contacts = contactRepository.searchContacts(search);
        } else if (category != null && !category.isEmpty()) {
            contacts = contactRepository.findByCategory(category);
        } else {
            contacts = contactRepository.findAll();
        }
        return contacts.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return convertToDto(contact);
    }

    @Override
    public ContactDto createContact(ContactCreateDto dto) {
        Contact contact = new Contact(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail(),
                dto.getPhoneNumber(),
                dto.getAddress(),
                dto.getCategory()
        );
        Contact saved = contactRepository.save(contact);
        return convertToDto(saved);
    }

    @Override
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        if (dto.getFirstName() != null) contact.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) contact.setLastName(dto.getLastName());
        if (dto.getEmail() != null) contact.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) contact.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAddress() != null) contact.setAddress(dto.getAddress());
        if (dto.getCategory() != null) contact.setCategory(dto.getCategory());

        Contact updated = contactRepository.save(contact);
        return convertToDto(updated);
    }

    @Override
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
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
        dto.setUpdatedAt(contact.getUpdatedAt());
        return dto;
    }
}
