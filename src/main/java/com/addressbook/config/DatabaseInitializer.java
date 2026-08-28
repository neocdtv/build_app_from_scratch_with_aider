package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableJpaRepositories("com.addressbook.repository")
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        List<Contact> sampleContacts = Arrays.asList(
                new Contact("John", "Doe", "john.doe@example.com", "555-0101", "123 Main St", "Family"),
                new Contact("Jane", "Smith", "jane.smith@example.com", "555-0102", "456 Oak Ave", "Work"),
                new Contact("Michael", "Johnson", "michael.j@example.com", "555-0103", "789 Pine Rd", "Friends"),
                new Contact("Emily", "Williams", "emily.w@example.com", "555-0104", "321 Elm Blvd", "Family"),
                new Contact("David", "Brown", "david.brown@example.com", "555-0105", "654 Maple Dr", "Work")
        );

        // Clear existing data and insert sample contacts
        contactRepository.deleteAll();
        contactRepository.saveAll(sampleContacts);
        System.out.println("Sample contacts loaded successfully!");
    }
}
