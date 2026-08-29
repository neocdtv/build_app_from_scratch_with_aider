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

    @Bean
    @Primary
    CommandLineRunner commandLineRunner(ContactRepository contactRepository) {
        return args -> {
            List<Contact> sampleContacts = Arrays.asList(
                    new Contact("John", "Smith", "john.smith@example.com", "555-1234", "123 Main St", "Family"),
                    new Contact("Jane", "Doe", "jane.doe@example.com", "555-5678", "456 Oak Ave", "Work"),
                    new Contact("Michael", "Johnson", "michael.j@example.com", "555-9012", "789 Pine Rd", "Family"),
                    new Contact("Emily", "Williams", "emily.w@example.com", "555-3456", "321 Elm Ln", "Work"),
                    new Contact("David", "Brown", "david.brown@example.com", "555-7890", "654 Maple Dr", "Friends")
            );

            contactRepository.saveAll(sampleContacts);
            System.out.println("Sample contacts inserted successfully!");
        };
    }
}
