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
            new Contact("Alice", "Smith", "alice@example.com", "555-0101", "123 Maple St", "Family"),
            new Contact("Bob", "Jones", "bob@work.com", "555-0202", "456 Oak Ave", "Work"),
            new Contact("Charlie", "Brown", "charlie@example.com", "555-0303", "789 Pine Rd", "Friend"),
            new Contact("Diana", "Prince", "diana@themyscira.com", "555-0404", "1 Amazon Way", "Work"),
            new Contact("Edward", "Norton", "ed@cinema.com", "555-0505", "321 Film Blvd", "Friend")
        ));
    }
}
