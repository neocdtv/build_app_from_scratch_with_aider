package com.example.addressbook.service.impl;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<ContactDto> findAll(String search, String category) {
        return contactRepository.searchAndFilter(search, category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ContactDto> findById(Long id) {
        return contactRepository.findById(id).map(this::mapToDto);
    }

    @Override
    public ContactDto create(ContactCreateDto dto) {
        Contact contact = mapToEntity(dto);
        contact = contactRepository.save(contact);
        return mapToDto(contact);
    }

    @Override
    public ContactDto update(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));

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

        contact = contactRepository.save(contact);
        return mapToDto(contact);
    }

    @Override
    public void delete(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
        contactRepository.delete(contact);
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

    private ContactDto mapToDto(Contact contact) {
        return new ContactDto(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                contact.getPhoneNumber(),
                contact.getAddress(),
                contact.getCategory(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }
}
