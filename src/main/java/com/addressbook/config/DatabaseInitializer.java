package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void run(String... args) {
        List<Contact> sampleContacts = Arrays.asList(
            new Contact("John", "Doe", "john.doe@example.com", "555-0101", "123 Main St", "Family"),
            new Contact("Jane", "Smith", "jane.smith@example.com", "555-0102", "456 Oak Ave", "Work"),
            new Contact("Bob", "Johnson", "bob.johnson@example.com", "555-0103", "789 Pine Rd", "Friend"),
            new Contact("Alice", "Williams", "alice.williams@example.com", "555-0104", "321 Elm St", "Family"),
            new Contact("Charlie", "Brown", "charlie.brown@example.com", "555-0105", "654 Cedar Ln", "Work")
        );

        contactRepository.saveAll(sampleContacts);
    }
}
