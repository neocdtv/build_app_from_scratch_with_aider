package com.example.addressbook.service;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;

import java.util.List;
import java.util.Optional;

public interface ContactService {
    List<ContactDto> getAllContacts(String search, String category);
    Optional<ContactDto> getContactById(Long id);
    ContactDto createContact(ContactCreateDto contactDto);
    ContactDto updateContact(Long id, ContactUpdateDto contactDto);
    void deleteContact(Long id);
}
