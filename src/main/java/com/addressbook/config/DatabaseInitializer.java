package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    private final ContactRepository contactRepository;
    
    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            List<Contact> sampleContacts = Arrays.asList(
                new Contact("John", "Smith", "john.smith@email.com", "555-0101", "123 Main St", "Family"),
                new Contact("Jane", "Doe", "jane.doe@email.com", "555-0102", "456 Oak Ave", "Friend"),
                new Contact("Robert", "Johnson", "r.johnson@email.com", "555-0103", "789 Pine Rd", "Colleague"),
                new Contact("Emily", "Brown", "emily.brown@email.com", "555-0104", "321 Elm St", "Family"),
                new Contact("Michael", "Davis", "m.davis@email.com", "555-0105", "654 Maple Dr", "Friend")
            );
            
            contactRepository.saveAll(sampleContacts);
        }
    }
}
