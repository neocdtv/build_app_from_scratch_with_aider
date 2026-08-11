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
        if (service.findAll().isEmpty()) {
            service.save(new SampleContact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main Street, Anytown, USA", "Family"));
            service.save(new SampleContact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Avenue, Somewhere, USA", "Work"));
            service.save(new SampleContact("Robert", "Johnson", "robert.j@example.com", "+1-555-9012", "789 Pine Road, Elsewhere, USA", "Friends"));
            service.save(new SampleContact("Emily", "Davis", "emily.d@example.com", "+1-555-3456", "321 Maple Lane, Nowhere, USA", "Family"));
            service.save(new SampleContact("Michael", "Brown", "michael.b@example.com", "+1-555-7890", "654 Cedar Blvd, Somewhere, USA", "Work"));
        }
    }

    private static class SampleContact extends Contact {
        public SampleContact(String firstName, String lastName, String email, String phoneNumber, String address, String category) {
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setPhoneNumber(phoneNumber);
            setAddress(address);
            setCategory(category);
        }
    }
}
