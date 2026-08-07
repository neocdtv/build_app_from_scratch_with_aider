package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ContactRepository repository;

    public DatabaseInitializer(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        repository.saveAll(List.of(
            new Contact("John", "Doe", "john@example.com", "1234567890", "123 Main St", "Family"),
            new Contact("Jane", "Smith", "jane@example.com", "0987654321", "456 Oak Ave", "Work"),
            new Contact("Alice", "Johnson", "alice@example.com", "1122334455", "789 Pine Rd", "Friend"),
            new Contact("Bob", "Brown", "bob@example.com", "5566778899", "321 Elm St", "Work"),
            new Contact("Charlie", "Davis", "charlie@example.com", "9988776655", "654 Maple Dr", "Family")
        ));
    }
}
