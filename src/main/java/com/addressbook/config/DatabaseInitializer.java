package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void run(String... args) throws Exception {
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St, Anytown", "Family"));
            contactRepository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave, Somewhere", "Work"));
            contactRepository.save(new Contact("Alice", "Johnson", "alice.j@example.com", "+1-555-9012", "789 Pine Rd, Nowhere", "Friend"));
            contactRepository.save(new Contact("Bob", "Brown", "bob.brown@example.com", "+1-555-3456", "321 Elm St, Somewhere", "Work"));
            contactRepository.save(new Contact("Charlie", "Davis", "charlie.d@example.com", "+1-555-7890", "654 Maple Ln, Anytown", "Family"));
        }
    }
}
