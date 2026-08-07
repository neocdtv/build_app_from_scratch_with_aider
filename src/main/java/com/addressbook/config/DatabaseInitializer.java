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
            repository.save(new Contact("Alice", "Smith", "alice@example.com", "555-0101", "123 Maple St", "Family"));
            repository.save(new Contact("Bob", "Jones", "bob@work.com", "555-0202", "456 Oak Ave", "Work"));
            repository.save(new Contact("Charlie", "Brown", "charlie@example.com", "555-0303", "789 Pine Rd", "Friend"));
            repository.save(new Contact("Diana", "Prince", "diana@themyscira.com", "555-0404", "1 Amazon Way", "Work"));
            repository.save(new Contact("Edward", "Norton", "ed@cinema.com", "555-0505", "22 Fight Club Ln", "Family"));
        };
    }
}
