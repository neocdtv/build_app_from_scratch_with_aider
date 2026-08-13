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
        repository.save(new Contact(null, "John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St, Anytown, USA", "Family"));
        repository.save(new Contact(null, "Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave, Somewhere, USA", "Work"));
        repository.save(new Contact(null, "Alice", "Johnson", "alice.j@example.com", "+1-555-9012", "789 Pine Rd, Elsewhere, USA", "Friend"));
        repository.save(new Contact(null, "Bob", "Williams", "bob.w@example.com", "+1-555-3456", "321 Elm St, Nowhere, USA", "Work"));
        repository.save(new Contact(null, "Clara", "Brown", "clara.b@example.com", "+1-555-7890", "654 Maple Dr, Anywhere, USA", "Family"));
    }
}
