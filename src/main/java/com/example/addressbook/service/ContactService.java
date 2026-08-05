package com.example.addressbook.service;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import java.util.List;

public interface ContactService {
    List<ContactDto> searchContacts(String search, String category);
    ContactDto getContactById(Long id);
    ContactDto createContact(ContactCreateDto dto);
    ContactDto updateContact(Long id, ContactUpdateDto dto);
    void deleteContact(Long id);
}
