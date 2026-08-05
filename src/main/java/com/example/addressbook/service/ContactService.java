package com.example.addressbook.service;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;

import java.util.List;

public interface ContactService {
    List<ContactDto> getAll(String search, String category);
    ContactDto getById(Long id);
    ContactDto create(ContactCreateDto dto);
    ContactDto update(Long id, ContactUpdateDto dto);
    void delete(Long id);
}
