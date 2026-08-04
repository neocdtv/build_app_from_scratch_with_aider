package com.example.addressbook;

import com.example.addressbook.exception.ResourceNotFoundException;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import com.example.addressbook.service.ContactService;
import com.example.addressbook.service.impl.ContactServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class ContactServiceTest {

    private ContactRepository contactRepository;
    private ContactService contactService;

    @BeforeEach
    void setUp() {
        contactRepository = Mockito.mock(ContactRepository.class);
        contactService = new ContactServiceImpl(contactRepository);
    }

    @Test
    void testGetAllContacts() {
        Contact contact1 = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        Contact contact2 = new Contact("Jane", "Smith", "jane@email.com", "+14155555678", "456 Oak Ave", "Work");
        when(contactRepository.findAll()).thenReturn(Arrays.asList(contact1, contact2));
        List<ContactDto> result = contactService.getAllContacts();
        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getFirstName());
    }

    @Test
    void testGetContactById() {
        Contact contact = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));
        ContactDto result = contactService.getContactById(1L);
        assertEquals("John", result.getFirstName());
    }

    @Test
    void testGetContactByIdNotFound() {
        when(contactRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> contactService.getContactById(1L));
    }

    @Test
    void testCreateContact() {
        ContactCreateDto dto = new ContactCreateDto("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        Contact saved = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        when(contactRepository.save(any(Contact.class))).thenReturn(saved);
        ContactDto result = contactService.createContact(dto);
        assertNotNull(result.getId());
        assertEquals("John", result.getFirstName());
    }

    @Test
    void testUpdateContact() {
        Contact contact = new Contact("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        ContactUpdateDto update = new ContactUpdateDto("John", "Doe", "john@email.com", "+14155551234", "456 Oak Ave", "Work");
        when(contactRepository.findById(1L)).thenReturn(Optional.of(contact));
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);
        ContactDto result = contactService.updateContact(1L, update);
        assertEquals("456 Oak Ave", result.getAddress());
    }

    @Test
    void testUpdateContactNotFound() {
        when(contactRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> contactService.updateContact(1L, new ContactUpdateDto()));
    }

    @Test
    void testDeleteContact() {
        when(contactRepository.existsById(1L)).thenReturn(true);
        contactService.deleteContact(1L);
        verify(contactRepository).deleteById(1L);
    }

    @Test
    void testDeleteContactNotFound() {
        when(contactRepository.existsById(1L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> contactService.deleteContact(1L));
    }
}
