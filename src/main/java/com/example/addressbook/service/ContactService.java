package com.example.addressbook.service;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;

import java.util.List;

public interface ContactService {
    List<ContactDto> findAll(String search, String category);
    ContactDto findById(Long id);
    ContactDto create(ContactCreateDto dto);
    ContactDto update(Long id, ContactUpdateDto dto);
    void deleteById(Long id);
}
