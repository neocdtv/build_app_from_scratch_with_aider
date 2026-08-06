package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        contactRepository.saveAll(Arrays.asList(
            new Contact("John", "Doe", "john.doe@example.com", "+1-555-0001", "123 Main St", "Family"),
            new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-0002", "456 Elm St", "Work"),
            new Contact("Alice", "Johnson", "alice.j@example.com", "+1-555-0003", "789 Oak St", "Friend"),
            new Contact("Bob", "Brown", "bob.brown@example.com", "+1-555-0004", "321 Pine St", "Work"),
            new Contact("Charlie", "Davis", "charlie.d@example.com", "+1-555-0005", "654 Maple St", "Family")
        ));
    }
}
