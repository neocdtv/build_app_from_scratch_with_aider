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
        repository.save(new Contact("John", "Doe", "john@example.com", "1234567890", "123 Main St", "Family"));
        repository.save(new Contact("Jane", "Smith", "jane@work.com", "0987654321", "456 Corp Blvd", "Work"));
        repository.save(new Contact("Alice", "Johnson", "alice@home.com", "1122334455", "789 Oak Ln", "Family"));
        repository.save(new Contact("Bob", "Brown", "bob@tech.com", "5566778899", "321 Pine Rd", "Work"));
        repository.save(new Contact("Charlie", "Davis", "charlie@web.com", "9988776655", "654 Maple Dr", "Friend"));
    }
}
