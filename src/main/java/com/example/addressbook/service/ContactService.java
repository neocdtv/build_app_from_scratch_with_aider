package com.example.addressbook.service;

import com.example.addressbook.model.dto.*;
import java.util.List;

public interface ContactService {
    List<ContactDto> getAllContacts(String search, String category);
    ContactDto getContactById(Long id);
    ContactDto createContact(ContactCreateDto dto);
    ContactDto updateContact(Long id, ContactUpdateDto dto);
    void deleteContact(Long id);
}
