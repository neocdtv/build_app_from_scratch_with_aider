package com.example.addressbook.config;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactService contactService;

    public DataInitializer(ContactService contactService) {
        this.contactService = contactService;
    }

    @Override
    public void run(String... args) {
        // Seed 5 sample contacts
        ContactCreateDto c1 = ContactCreateDto.builder()
            .firstName("Alice")
            .lastName("Smith")
            .email("alice@example.com")
            .phoneNumber("+12025551234")
            .address("123 Main St, Springfield")
            .category("Family")
            .build();
        ContactCreateDto c2 = ContactCreateDto.builder()
            .firstName("Bob")
            .lastName("Jones")
            .email("bob@example.com")
            .phoneNumber("+12025554321")
            .address("456 Oak Ave, Metropolis")
            .category("Work")
            .build();
        ContactCreateDto c3 = ContactCreateDto.builder()
            .firstName("Carol")
            .lastName("White")
            .email("carol@example.com")
            .phoneNumber("+12025556789")
            .address("789 Pine Ln, Gotham")
            .category("Friends")
            .build();
        ContactCreateDto c4 = ContactCreateDto.builder()
            .firstName("David")
            .lastName("Brown")
            .email("david@example.com")
            .phoneNumber("+12025550123")
            .address("321 Elm St, Smallville")
            .category("Work")
            .build();
        ContactCreateDto c5 = ContactCreateDto.builder()
            .firstName("Eve")
            .lastName("Davis")
            .email("eve@example.com")
            .phoneNumber("+12025554567")
            .address("654 Maple Dr, Star City")
            .category("Family")
            .build();
        contactService.create(c1);
        contactService.create(c2);
        contactService.create(c3);
        contactService.create(c4);
        contactService.create(c5);
    }
}
