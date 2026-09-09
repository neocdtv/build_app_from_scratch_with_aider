package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(ContactRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            Contact john = new Contact("John", "Doe", "john.doe@example.com", "+1-555-1234",
                    "123 Main Street, Anytown, USA", "Family");
            Contact jane = new Contact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678",
                    "456 Oak Avenue, Springfield, USA", "Work");
            Contact bob = new Contact("Bob", "Johnson", "bob.johnson@example.com", "+1-555-9012",
                    "789 Pine Road, Rivertown, USA", "Friends");
            Contact alice = new Contact("Alice", "Williams", "alice.williams@example.com", "+1-555-3456",
                    "321 Elm Street, Lakeside, USA", "Family");
            Contact charlie = new Contact("Charlie", "Brown", "charlie.brown@example.com", "+1-555-7890",
                    "654 Maple Drive, Hilltown, USA", "Work");

            repository.saveAll(java.util.List.of(john, jane, bob, alice, charlie));
        };
    }
}
