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
    public void run(Iterable<Object> args) {
        if (args != null) {
            for (Object arg : args) {
                // Just placeholder, we'll populate sample data directly
            }
        }
    }
    
    @Override
    public void run(String... args) {
        // Populate sample contacts on startup
        contactRepository.saveAll(createSampleContacts());
    }
    
    private java.util.List<Contact> createSampleContacts() {
        return java.util.List.of(
            new Contact("John", "Smith", "john.smith@example.com", "555-123-4567", "123 Main St", "Family"),
            new Contact("Jane", "Doe", "jane.doe@example.com", "555-234-5678", "456 Oak Ave", "Work"),
            new Contact("Michael", "Johnson", "michael.j@example.com", "555-345-6789", "789 Pine Rd", "Family"),
            new Contact("Sarah", "Williams", "sarah.williams@example.com", "555-456-7890", "321 Elm St", "Friends"),
            new Contact("David", "Brown", "david.brown@example.com", "555-567-8901", "654 Maple Dr", "Work")
        );
    }
}
