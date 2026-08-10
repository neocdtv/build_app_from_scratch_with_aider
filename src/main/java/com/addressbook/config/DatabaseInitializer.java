package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            Contact contact1 = new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St", "Family");
            Contact contact2 = new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave", "Work");
            Contact contact3 = new Contact("Bob", "Johnson", "bob.johnson@example.com", "+1-555-9012", "789 Pine Rd", "Friend");
            Contact contact4 = new Contact("Alice", "Williams", "alice.williams@example.com", "+1-555-3456", "321 Elm Blvd", "Work");
            Contact contact5 = new Contact("Charlie", "Brown", "charlie.brown@example.com", "+1-555-7890", "654 Maple Ln", "Family");

            contactRepository.saveAll(List.of(contact1, contact2, contact3, contact4, contact5));
        }
    }
}
