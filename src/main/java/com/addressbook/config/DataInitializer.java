package com.addressbook.config;
import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initData(ContactRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Contact("John","Doe","john@example.com","+1-555-1234","123 Main St","Family"));
                repo.save(new Contact("Jane","Smith","jane@example.com","+1-555-5678","456 Oak Ave","Work"));
                repo.save(new Contact("Alice","Johnson","alice@example.com","+1-555-9012","789 Pine Rd","Friends"));
                repo.save(new Contact("Bob","Brown","bob@example.com","+1-555-3456","101 Elm St","Work"));
                repo.save(new Contact("Carol","White","carol@example.com","+1-555-7890","202 Maple Ln","Family"));
            }
        };
    }
}
