package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    @Autowired
    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            List<Contact> sampleContacts = List.of(
                new Contact("John", "Smith", "john.smith@example.com", "+1-555-0101", "123 Main St, Springfield", "Family"),
                new Contact("Sarah", "Johnson", "sarah.j@example.com", "+1-555-0102", "456 Oak Ave, Portland", "Work"),
                new Contact("Michael", "Brown", "m.brown@example.com", "+1-555-0103", "789 Pine Rd, Seattle", "Family"),
                new Contact("Emily", "Davis", "emily.d@example.com", "+1-555-0104", "321 Elm St, Denver", "Work"),
                new Contact("David", "Wilson", "d.wilson@example.com", "+1-555-0105", "654 Cedar Ln, Austin", "Family")
            );

            contactRepository.saveAll(sampleContacts);
        }
    }
}
