package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DatabaseInitializer {
    
    private static final List<Contact> SAMPLE_CONTACTS = Arrays.asList(
        new Contact("John", "Smith", "john.smith@email.com", "555-123-4567", "123 Main St", "Family"),
        new Contact("Jane", "Doe", "jane.doe@email.com", "555-234-5678", "456 Oak Ave", "Work"),
        new Contact("Michael", "Johnson", "michael.j@email.com", "555-345-6789", "789 Pine Rd", "Friends"),
        new Contact("Emily", "Williams", "emily.williams@email.com", "555-456-7890", "321 Elm St", "Family"),
        new Contact("David", "Brown", "david.brown@email.com", "555-567-8901", "654 Maple Dr", "Work")
    );
    
    @Bean
    @Primary
    CommandLineRunner commandLineRunner(ContactRepository contactRepository) {
        return args -> {
            SAMPLE_CONTACTS.forEach(contact -> contactRepository.save(contact));
        };
    }
}
