package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ContactRepository repository;

    public DatabaseInitializer(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new Contact(null, "John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St", "Family"));
            repository.save(new Contact(null, "Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave", "Work"));
            repository.save(new Contact(null, "Bob", "Johnson", "bob.j@example.com", "+1-555-9012", "789 Pine Rd", "Friends"));
            repository.save(new Contact(null, "Alice", "Williams", "alice.w@example.com", "+1-555-3456", "101 Elm Blvd", "Work"));
            repository.save(new Contact(null, "Charlie", "Brown", "charlie.b@example.com", "+1-555-7890", "202 Maple Dr", "Family"));
        }
    }
}
