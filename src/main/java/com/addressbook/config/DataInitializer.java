package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DataInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        // Avoid seeding duplicates on every restart if schema allows persistence or H2 config changes
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St, Anytown, USA", "Family"));
            contactRepository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave, Somewhere, USA", "Work"));
            contactRepository.save(new Contact("Robert", "Johnson", "rob.j@example.com", "+1-555-9012", "789 Pine Rd, Elsewhere, USA", "Family"));
            contactRepository.save(new Contact("Emily", "Davis", "emily.d@example.com", "+1-555-3456", "101 Cedar Ln, Nowhere, USA", "Friend"));
            contactRepository.save(new Contact("Michael", "Wilson", "m.wilson@example.com", "+1-555-7890", "202 Maple Dr, Here, USA", "Work"));
        }
    }
}
