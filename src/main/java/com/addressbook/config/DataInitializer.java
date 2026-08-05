package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact(
                    null, "John", "Doe", "john.doe@example.com", 
                    "+1-555-0101", "123 Work St", "Work"));
            
            contactRepository.save(new Contact(
                    null, "Jane", "Smith", "jane.smith@example.com", 
                    "+1-555-0102", "456 Home Ave", "Family"));
            
            contactRepository.save(new Contact(
                    null, "Bob", "Johnson", "bob.johnson@example.com", 
                    "+1-555-0103", "789 Friend Rd", "Friends"));
            
            contactRepository.save(new Contact(
                    null, "Alice", "Brown", "alice.brown@example.com", 
                    "+1-555-0104", "321 Office Blvd", "Work"));
            
            contactRepository.save(new Contact(
                    null, "Charlie", "Wilson", "charlie.wilson@example.com", 
                    "+1-555-0105", "654 Home Dr", "Family"));
        }
    }
}
