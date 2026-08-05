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

import java.time.format.DateTimeFormatter;
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
        List<Contact> contacts = contactRepository.searchContacts(search, category);
        return contacts.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return toDto(contact);
    }

    @Override
    @Transactional
    public ContactDto createContact(ContactCreateDto dto) {
        Contact contact = new Contact();
        mapDtoToEntity(dto, contact);
        contact = contactRepository.save(contact);
        return toDto(contact);
    }

    @Override
    @Transactional
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        
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
    @Transactional
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    private void mapDtoToEntity(Object dto, Contact contact) {
        if (dto instanceof ContactCreateDto createDto) {
            contact.setFirstName(createDto.getFirstName());
            contact.setLastName(createDto.getLastName());
            contact.setEmail(createDto.getEmail());
            contact.setPhoneNumber(createDto.getPhoneNumber());
            contact.setAddress(createDto.getAddress());
            contact.setCategory(createDto.getCategory());
        }
    }

    private ContactDto toDto(Contact contact) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new ContactDto(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                contact.getPhoneNumber(),
                contact.getAddress(),
                contact.getCategory(),
                contact.getCreatedAt() != null ? contact.getCreatedAt().format(formatter) : null,
                contact.getUpdatedAt() != null ? contact.getUpdatedAt().format(formatter) : null
        );
    }
}
