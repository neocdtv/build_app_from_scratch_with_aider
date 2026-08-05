package com.example.addressbook.service.impl;
import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.*;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository repository;

    public ContactServiceImpl(ContactRepository repository) { this.repository = repository; }

    @Override
    public List<ContactDto> searchContacts(String search, String category) {
        return repository.searchContacts(search, category).stream().map(this::toDto).toList();
    }

    @Override
    public ContactDto getContactById(Long id) {
        return toDto(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id)));
    }

    @Override
    public ContactDto createContact(ContactCreateDto dto) {
        Contact c = mapToEntity(dto, null);
        repository.save(c);
        return toDto(c);
    }

    @Override
    public ContactDto updateContact(Long id, ContactUpdateDto dto) {
        Contact existing = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) existing.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
        if (dto.getCategory() != null) existing.setCategory(dto.getCategory());
        repository.save(existing);
        return toDto(existing);
    }

    @Override
    public void deleteContact(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Contact", "id", id);
        repository.deleteById(id);
    }

    private Contact mapToEntity(ContactCreateDto dto, Long id) {
        Contact c = new Contact();
        c.setId(id);
        c.setFirstName(dto.getFirstName());
        c.setLastName(dto.getLastName());
        c.setEmail(dto.getEmail());
        c.setPhoneNumber(dto.getPhoneNumber());
        c.setAddress(dto.getAddress());
        c.setCategory(dto.getCategory());
        return c;
    }

    private ContactDto toDto(Contact entity) {
        ContactDto dto = new ContactDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setAddress(entity.getAddress());
        dto.setCategory(entity.getCategory());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
