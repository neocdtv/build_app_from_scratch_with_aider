package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ContactService service;

    public DatabaseInitializer(ContactService service) {
        this.service = service;
    }

    @Override
    public void run(String... args) {
        service.createContact(new Contact(null, "John", "Doe", "john@example.com", "1234567890", "123 Main St", "Family"));
        service.createContact(new Contact(null, "Jane", "Smith", "jane@example.com", "0987654321", "456 Oak Ave", "Work"));
        service.createContact(new Contact(null, "Bob", "Builder", "bob@example.com", "5555555555", "789 Construction Rd", "Work"));
        service.createContact(new Contact(null, "Alice", "Wonder", "alice@example.com", "1112223333", "1 Wonderland Ln", "Friend"));
        service.createContact(new Contact(null, "Charlie", "Brown", "charlie@example.com", "4445556666", "1 Peanuts St", "Family"));
    }
}
