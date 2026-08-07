package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ContactRepository contactRepository;
    public DataInitializer(ContactRepository contactRepository) { this.contactRepository = contactRepository; }

    @Override
    public void run(String... args) throws Exception {
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main Street, Anytown, USA", "Family"));
            contactRepository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Avenue, Somewhere, USA", "Work"));
            contactRepository.save(new Contact("Bob", "Johnson", "bob.johnson@example.com", "+1-555-9012", "789 Pine Road, Elsewhere, USA", "Friends"));
            contactRepository.save(new Contact("Alice", "Williams", "alice.williams@example.com", "+1-555-3456", "321 Elm Street, Nowhere, USA", "Family"));
            contactRepository.save(new Contact("Charlie", "Brown", "charlie.brown@example.com", "+1-555-7890", "654 Maple Drive, Anywhere, USA", "Work"));
        }
    }
}
