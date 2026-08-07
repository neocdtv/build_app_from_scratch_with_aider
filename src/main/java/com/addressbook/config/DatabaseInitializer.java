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
    public void run(String... args) throws Exception {
        contactRepository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-0001", "123 Main St", "Family"));
        contactRepository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-0002", "456 Oak Ave", "Work"));
        contactRepository.save(new Contact("Bob", "Johnson", "bob.j@example.com", "+1-555-0003", "789 Pine Rd", "Friend"));
        contactRepository.save(new Contact("Alice", "Williams", "alice.w@example.com", "+1-555-0004", "321 Elm St", "Family"));
        contactRepository.save(new Contact("Charlie", "Brown", "charlie.b@example.com", "+1-555-0005", "654 Maple Dr", "Work"));
    }
}
