package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St, Anytown, USA", "Family"));
            contactRepository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave, Somewhere, USA", "Work"));
            contactRepository.save(new Contact("Alice", "Johnson", "alice.j@example.com", "+1-555-9012", "789 Pine Rd, Elsewhere, USA", "Family"));
            contactRepository.save(new Contact("Bob", "Williams", "bob.w@example.com", "+1-555-3456", "321 Elm St, Nowhere, USA", "Work"));
            contactRepository.save(new Contact("Carol", "Brown", "carol.b@example.com", "+1-555-7890", "654 Maple Dr, Anywhere, USA", "Friend"));
        }
    }
}
