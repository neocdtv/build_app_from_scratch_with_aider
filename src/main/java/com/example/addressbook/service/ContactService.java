package com.example.addressbook.service;
import com.example.addressbook.model.dto.*;
import java.util.List;
public interface ContactService {
    List<ContactDto> findAll(String search, String category);
    ContactDto findById(Long id);
    ContactDto create(ContactCreateDto dto);
    ContactDto update(Long id, ContactUpdateDto dto);
    void delete(Long id);
}
