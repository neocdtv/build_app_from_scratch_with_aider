package com.example.addressbook.service.impl;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<ContactDto> getAllContacts(String search, String category) {
        List<Contact> contacts = contactRepository.searchContacts(category, search);
        return contacts.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ContactDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));
        return toDto(contact);
    }

    @Override
    @Transactional
    public ContactDto createContact(ContactCreateDto dto) {
        Contact contact = new Contact(dto.getFirstName(), dto.getLastName(), dto.getEmail(), 
                dto.getPhoneNumber(), dto.getAddress(), dto.getCategory());
        Contact saved = contactRepository.save(contact);
        return toDto(saved);
    }

    @Override
    @Transactional
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));

        if (dto.getFirstName() != null) contact.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) contact.setLastName(dto.getLastName());
        if (dto.getEmail() != null) contact.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) contact.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAddress() != null) contact.setAddress(dto.getAddress());
        if (dto.getCategory() != null) contact.setCategory(dto.getCategory());

        Contact updated = contactRepository.save(contact);
        return toDto(updated);
    }

    @Override
    @Transactional
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new EntityNotFoundException("Contact not found with id: " + id);
        }
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
