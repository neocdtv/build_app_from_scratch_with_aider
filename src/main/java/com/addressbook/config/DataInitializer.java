package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ContactRepository repository;

    public DataInitializer(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            repository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St", "Family"));
            repository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave", "Work"));
            repository.save(new Contact("Alice", "Johnson", "alice.j@example.com", "+1-555-9012", "789 Pine Rd", "Friends"));
            repository.save(new Contact("Bob", "Brown", "bob.b@example.com", "+1-555-3456", "321 Elm St", "Work"));
            repository.save(new Contact("Carol", "White", "carol.w@example.com", "+1-555-7890", "654 Maple Dr", "Family"));
        }
    }
}
