package com.example.addressbook.service.impl;
import com.example.addressbook.model.dto.*;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.addressbook.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {
    private final ContactRepository repository;
    public ContactServiceImpl(ContactRepository repository) { this.repository = repository; }

    @Override public List<ContactDto> findAll(String search, String category) {
        return repository.searchContacts(search, category).stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public ContactDto findById(Long id) {
        return toDto(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id)));
    }

    @Override @Transactional
    public ContactDto create(ContactCreateDto dto) {
        Contact c = new Contact(); mapToEntity(dto, c, true);
        return toDto(repository.save(c));
    }

    @Override @Transactional
    public ContactDto update(Long id, ContactUpdateDto dto) {
        Contact c = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        mapToEntity(dto, c, false);
        return toDto(repository.save(c));
    }

    @Override @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Contact not found with id: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(Object dto, Contact c, boolean isNew) {
        if (isNew && dto instanceof ContactCreateDto d) {
            c.setFirstName(d.getFirstName()); c.setLastName(d.getLastName()); c.setEmail(d.getEmail());
            c.setPhoneNumber(d.getPhoneNumber()); c.setAddress(d.getAddress()); c.setCategory(d.getCategory());
        } else if (!isNew && dto instanceof ContactUpdateDto d) {
            if (d.getFirstName() != null) c.setFirstName(d.getFirstName());
            if (d.getLastName() != null) c.setLastName(d.getLastName());
            if (d.getEmail() != null) c.setEmail(d.getEmail());
            if (d.getPhoneNumber() != null) c.setPhoneNumber(d.getPhoneNumber());
            if (d.getAddress() != null) c.setAddress(d.getAddress());
            if (d.getCategory() != null) c.setCategory(d.getCategory());
        }
    }

    private ContactDto toDto(Contact c) {
        ContactDto d = new ContactDto();
        d.setId(c.getId()); d.setFirstName(c.getFirstName()); d.setLastName(c.getLastName());
        d.setEmail(c.getEmail()); d.setPhoneNumber(c.getPhoneNumber());
        d.setAddress(c.getAddress()); d.setCategory(c.getCategory());
        d.setCreatedAt(c.getCreatedAt()); d.setUpdatedAt(c.getUpdatedAt());
        return d;
    }
}
