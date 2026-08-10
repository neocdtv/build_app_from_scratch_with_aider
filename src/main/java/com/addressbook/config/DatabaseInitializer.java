package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    @Autowired
    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        Arrays.asList(
            new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main Street", "Family"),
            new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave", "Work"),
            new Contact("Emily", "Jones", "emily.jones@example.com", "+1-555-9012", "789 Pine Rd", "Family"),
            new Contact("Michael", "Brown", "michael.brown@example.com", "+1-555-3456", "101 Maple Ln", "Work"),
            new Contact("Sarah", "Davis", "sarah.davis@example.com", "+1-555-7890", "202 Cedar St", "Friends")
        ).forEach(contactRepository::save);
    }
}
