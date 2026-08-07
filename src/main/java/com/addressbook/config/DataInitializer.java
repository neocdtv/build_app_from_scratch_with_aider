package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ContactRepository repository) {
        return args -> {
            repository.save(new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main Street, Anytown, USA", "Family"));
            repository.save(new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Avenue, Somewhere, USA", "Work"));
            repository.save(new Contact("Alice", "Johnson", "alice.johnson@example.com", "+1-555-9012", "789 Pine Road, Elsewhere, USA", "Friends"));
            repository.save(new Contact("Bob", "Brown", "bob.brown@example.com", "+1-555-3456", "321 Elm Street, Nowhere, USA", "Family"));
            repository.save(new Contact("Charlie", "Davis", "charlie.davis@example.com", "+1-555-7890", "654 Maple Lane, Anywhere, USA", "Work"));
        };
    }
}
