package com.example.addressbook.service;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;

import java.util.List;

public interface ContactService {
    List<ContactDto> getAllContacts();
    List<ContactDto> searchContacts(String search, String category);
    ContactDto getContactById(Long id);
    ContactDto createContact(ContactCreateDto contactCreateDto);
    ContactDto updateContact(Long id, ContactUpdateDto contactUpdateDto);
    void deleteContact(Long id);
}
