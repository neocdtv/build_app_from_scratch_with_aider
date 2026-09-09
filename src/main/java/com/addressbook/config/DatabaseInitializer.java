package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void run(String... args) {
        // Clear existing data to ensure clean seed
        contactRepository.deleteAll();

        List<Contact> sampleContacts = List.of(
            new Contact("John", "Smith", "john.smith@email.com", "555-0101", "123 Main St", "Family"),
            new Contact("Jane", "Doe", "jane.doe@email.com", "555-0102", "456 Oak Ave", "Work"),
            new Contact("Bob", "Johnson", "bob.j@email.com", "555-0103", "789 Pine Rd", "Friend"),
            new Contact("Alice", "Williams", "alice.w@email.com", "555-0104", "321 Elm St", "Work"),
            new Contact("Charlie", "Brown", "charlie.b@email.com", "555-0105", "654 Maple Dr", "Family")
        );

        contactRepository.saveAll(sampleContacts);
    }
}
