package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    @Autowired
    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        contactRepository.saveAll(generateSampleContacts());
    }

    private List<Contact> generateSampleContacts() {
        return List.of(
            new Contact("Alice", "Johnson", "alice.johnson@email.com", "+1-555-0101", "123 Maple Street, Springfield", "Family"),
            new Contact("Bob", "Smith", "bob.smith@email.com", "+1-555-0102", "456 Oak Avenue, Portland", "Work"),
            new Contact("Carol", "Williams", "carol.williams@email.com", "+1-555-0103", "789 Pine Lane, Seattle", "Family"),
            new Contact("David", "Brown", "david.brown@email.com", "+1-555-0104", "321 Elm Drive, Austin", "Work"),
            new Contact("Emma", "Davis", "emma.davis@email.com", "+1-555-0105", "654 Cedar Court, Denver", "Family")
        );
    }
}
