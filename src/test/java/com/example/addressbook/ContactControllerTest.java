package com.example.addressbook;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.service.ContactService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ContactControllerTest {

    private ContactService contactService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        contactService = Mockito.mock(ContactService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new ContactController(contactService)).build();
    }

    @Test
    void testGetAllContacts() throws Exception {
        List<ContactCreateDto> contacts = Arrays.asList(
                new ContactCreateDto("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family"),
                new ContactCreateDto("Jane", "Smith", "jane@email.com", "+14155555678", "456 Oak Ave", "Work")
        );
        when(contactService.getAllContacts()).thenReturn(contacts);
        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetContactById() throws Exception {
        ContactCreateDto contact = new ContactCreateDto("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        when(contactService.getContactById(1L)).thenReturn(contact);
        mockMvc.perform(get("/api/contacts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void testCreateContact() throws Exception {
        ContactCreateDto contact = new ContactCreateDto("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        when(contactService.createContact(any(ContactCreateDto.class))).thenReturn(contact);
        mockMvc.perform(post("/api/contacts")
                        .contentType("application/json")
                        .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@email.com\",\"phoneNumber\":\"+14155551234\",\"address\":\"123 Main St\",\"category\":\"Family\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void testUpdateContact() throws Exception {
        ContactCreateDto contact = new ContactCreateDto("John", "Doe", "john@email.com", "+14155551234", "123 Main St", "Family");
        ContactUpdateDto update = new ContactUpdateDto("John", "Doe", "john@email.com", "+14155551234", "456 Oak Ave", "Work");
        when(contactService.updateContact(anyLong(), any(ContactUpdateDto.class))).thenReturn(contact);
        mockMvc.perform(put("/api/contacts/1")
                        .contentType("application/json")
                        .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@email.com\",\"phoneNumber\":\"+14155551234\",\"address\":\"456 Oak Ave\",\"category\":\"Work\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("456 Oak Ave"));
    }

    @Test
    void testDeleteContact() throws Exception {
        when(contactService.deleteContact(anyLong())).thenAnswer(invocation -> {
            contactService.deleteContact(1L);
            return null;
        });
        mockMvc.perform(delete("/api/contacts/1"))
                .andExpect(status().isNoContent());
    }
}
