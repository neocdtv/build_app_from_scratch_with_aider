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
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-0101", "123 Maple St", "Family"));
            contactRepository.save(new Contact("Jane", "Smith", "jane.smith@work.com", "+1-555-0102", "456 Oak Ave", "Work"));
            contactRepository.save(new Contact("Alice", "Johnson", "alice.j@gmail.com", "+1-555-0103", "789 Pine Rd", "Friend"));
            contactRepository.save(new Contact("Bob", "Brown", "bob.brown@provider.net", "+1-555-0104", "321 Birch Ln", "Work"));
            contactRepository.save(new Contact("Charlie", "Davis", "charlie.d@example.org", "+1-555-0105", "654 Cedar Ct", "Family"));
        }
    }
}
