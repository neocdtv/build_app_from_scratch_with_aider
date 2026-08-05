package com.example.addressbook.service.impl;

import com.example.addressbook.model.dto.*;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ContactServiceImpl(ContactRepository contactRepository, ModelMapper modelMapper) {
        this.contactRepository = contactRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<ContactDto> findAll(String search, String category) {
        return contactRepository.findBySearchAndCategory(search, category)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ContactDto findById(Long id) {
        return contactRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    public ContactDto create(ContactCreateDto dto) {
        Contact contact = modelMapper.map(dto, Contact.class);
        contactRepository.save(contact);
        return toDto(contact);
    }

    @Override
    public ContactDto update(Long id, ContactUpdateDto dto) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));
        modelMapper.map(dto, existing);
        contactRepository.save(existing);
        return toDto(existing);
    }

    @Override
    public void deleteById(Long id) {
        contactRepository.deleteById(id);
    }

    private ContactDto toDto(Contact contact) {
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
