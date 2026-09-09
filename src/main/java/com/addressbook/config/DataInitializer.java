package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the in-memory H2 database with 5 sample contacts on startup.
 * Runs only when the table is empty so re-restarts do not duplicate data.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DataInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (contactRepository.count() > 0) {
            return;
        }

        contactRepository.save(new Contact("John", "Doe", "john.doe@example.com",
                "+1-555-1234", "123 Main Street, Anytown, USA", "Family"));
        contactRepository.save(new Contact("Jane", "Smith", "jane.smith@example.com",
                "+1-555-5678", "456 Oak Avenue, Springfield, IL", "Work"));
        contactRepository.save(new Contact("Bob", "Johnson", "bob.johnson@example.com",
                "+1-555-9012", "789 Pine Road, Riverton, WY", "Friends"));
        contactRepository.save(new Contact("Alice", "Brown", "alice.brown@example.com",
                "+1-555-3456", "321 Elm Boulevard, Lakeside, CA", "Family"));
        contactRepository.save(new Contact("Charlie", "Wilson", "charlie.wilson@example.com",
                "+1-555-7890", "654 Maple Lane, Hillside, NJ", "Work"));
    }
}
