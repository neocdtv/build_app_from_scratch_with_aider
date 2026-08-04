package com.example.addressbook.service.impl;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public List<ContactDto> getAllContacts() {
        Pageable pageable = PageRequest.of(0, 100);
        return contactRepository.findAll(pageable).getContent().stream()
                .map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public List<ContactDto> searchContacts(String search, String category) {
        Pageable pageable = PageRequest.of(0, 100);
        if (search != null && !search.isEmpty()) {
            List<Contact> results = contactRepository.searchBy(search, pageable);
            if (category != null && !category.isEmpty()) {
                results = results.stream()
                        .filter(c -> category.equals(c.getCategory()))
                        .collect(Collectors.toList());
            }
            return results.stream().map(this::convertToDto).collect(Collectors.toList());
        } else if (category != null && !category.isEmpty()) {
            List<Contact> results = contactRepository.findByCategory(category, pageable);
            return results.stream().map(this::convertToDto).collect(Collectors.toList());
        }
        return getAllContacts();
    }

    @Override
    public ContactDto getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return convertToDto(contact);
    }

    @Override
    public ContactDto createContact(ContactCreateDto contactCreateDto) {
        Contact contact = new Contact();
        contact.setFirstName(contactCreateDto.getFirstName());
        contact.setLastName(contactCreateDto.getLastName());
        contact.setEmail(contactCreateDto.getEmail());
        contact.setPhoneNumber(contactCreateDto.getPhoneNumber());
        contact.setAddress(contactCreateDto.getAddress());
        contact.setCategory(contactCreateDto.getCategory());
        Contact savedContact = contactRepository.save(contact);
        return convertToDto(savedContact);
    }

    @Override
    public ContactDto updateContact(Long id, ContactUpdateDto contactUpdateDto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        if (contactUpdateDto.getFirstName() != null) {
            contact.setFirstName(contactUpdateDto.getFirstName());
        }
        if (contactUpdateDto.getLastName() != null) {
            contact.setLastName(contactUpdateDto.getLastName());
        }
        if (contactUpdateDto.getEmail() != null) {
            contact.setEmail(contactUpdateDto.getEmail());
        }
        if (contactUpdateDto.getPhoneNumber() != null) {
            contact.setPhoneNumber(contactUpdateDto.getPhoneNumber());
        }
        if (contactUpdateDto.getAddress() != null) {
            contact.setAddress(contactUpdateDto.getAddress());
        }
        if (contactUpdateDto.getCategory() != null) {
            contact.setCategory(contactUpdateDto.getCategory());
        }
        Contact updatedContact = contactRepository.save(contact);
        return convertToDto(updatedContact);
    }

    @Override
    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    private ContactDto convertToDto(Contact contact) {
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
