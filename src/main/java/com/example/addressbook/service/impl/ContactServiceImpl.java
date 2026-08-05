package com.example.addressbook.service.impl;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.beans.BeanUtils;
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
    public List<ContactDto> getAllContacts(String search, String category) {
        List<Contact> contacts;
        
        if (search != null && !search.isEmpty()) {
            contacts = contactRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                    search, search, search);
        } else {
            contacts = contactRepository.findAll();
        }
        
        if (category != null && !category.isEmpty()) {
            contacts = contacts.stream()
                    .filter(contact -> category.equals(contact.getCategory()))
                    .collect(Collectors.toList());
        }
        
        return contacts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<ContactDto> getContactById(Long id) {
        return contactRepository.findById(id)
                .map(this::convertToDto);
    }
    
    @Override
    public ContactDto createContact(ContactCreateDto contactDto) {
        Contact contact = new Contact();
        BeanUtils.copyProperties(contactDto, contact);
        Contact savedContact = contactRepository.save(contact);
        return convertToDto(savedContact);
    }
    
    @Override
    public ContactDto updateContact(Long id, ContactUpdateDto contactDto) {
        Contact existingContact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        
        if (contactDto.getFirstName() != null) {
            existingContact.setFirstName(contactDto.getFirstName());
        }
        if (contactDto.getLastName() != null) {
            existingContact.setLastName(contactDto.getLastName());
        }
        if (contactDto.getEmail() != null) {
            existingContact.setEmail(contactDto.getEmail());
        }
        if (contactDto.getPhoneNumber() != null) {
            existingContact.setPhoneNumber(contactDto.getPhoneNumber());
        }
        if (contactDto.getAddress() != null) {
            existingContact.setAddress(contactDto.getAddress());
        }
        if (contactDto.getCategory() != null) {
            existingContact.setCategory(contactDto.getCategory());
        }
        
        Contact updatedContact = contactRepository.save(existingContact);
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
