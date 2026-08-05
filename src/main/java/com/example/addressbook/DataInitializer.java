package com.example.addressbook;

import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ContactService service;

    public DataInitializer(ContactService service) { this.service = service; }

    @Override
    public void run(String... args) {
        service.createContact(new ContactCreateDto("John", "Doe", "john@example.com", "+1234567890", "123 Main St", "Friend"));
        service.createContact(new ContactCreateDto("Jane", "Smith", "jane@example.com", "+1987654321", "456 Oak Ave", "Family"));
        service.createContact(new ContactCreateDto("Bob", "Builder", "bob@work.com", "+1122334455", "789 Construction Rd", "Work"));
        service.createContact(new ContactCreateDto("Alice", "Wonder", "alice@magic.com", "+1555666777", "Wonderland", "Friend"));
        service.createContact(new ContactCreateDto("Charlie", "Brown", "charlie@peanuts.com", "+1999888777", "Peanuts Lane", "Family"));
    }
}
