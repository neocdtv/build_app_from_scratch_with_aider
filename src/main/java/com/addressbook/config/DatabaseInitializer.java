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
        repository.save(new Contact("John", "Doe", "john.doe@example.com", "555-0101", "123 Apple St", "Family"));
        repository.save(new Contact("Jane", "Smith", "jane.smith@work.com", "555-0202", "456 Orange Ave", "Work"));
        repository.save(new Contact("Alice", "Johnson", "alice.j@provider.net", "555-0303", "789 Banana Blvd", "Friends"));
        repository.save(new Contact("Bob", "Brown", "bob.b@test.com", "555-0404", "321 Grape Rd", "Work"));
        repository.save(new Contact("Charlie", "Davis", "charlie.d@mail.com", "555-0505", "654 Pear Ln", "Family"));
    }
}
