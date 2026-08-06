package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(ContactRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Contact("John", "Doe", "john.doe@example.com",
                        "+1-555-1234", "123 Main Street, Anytown, USA", "Family"));
                repository.save(new Contact("Jane", "Smith", "jane.smith@example.com",
                        "+1-555-5678", "456 Oak Avenue, Othertown, USA", "Work"));
                repository.save(new Contact("Bob", "Johnson", "bob.johnson@example.com",
                        "+1-555-9012", "789 Pine Road, Sometown, USA", "Friend"));
                repository.save(new Contact("Alice", "Williams", "alice.williams@example.com",
                        "+1-555-3456", "321 Maple Street, Anycity, USA", "Family"));
                repository.save(new Contact("Mike", "Brown", "mike.brown@example.com",
                        "+1-555-7890", "654 Elm Lane, Otherville, USA", "Work"));
            }
        };
    }
}
