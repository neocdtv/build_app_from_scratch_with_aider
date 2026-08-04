package com.example.addressbook.initializer;

import com.example.addressbook.model.Contact;
import com.example.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    @Autowired
    public DataInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        if (contactRepository.count() == 0) {
            contactRepository.save(new Contact("Alice", "Johnson", "alice.johnson@example.com", "555-1234", "123 Maple St, Springfield", "Friend"));
            contactRepository.save(new Contact("Bob", "Smith", "bob.smith@example.com", "555-5678", "456 Oak Ave, Metropolis", "Colleague"));
            contactRepository.save(new Contact("Charlie", "Brown", "charlie.brown@example.com", "555-9012", "789 Pine Ln, Gotham", "Family"));
            contactRepository.save(new Contact("Diana", "Prince", "diana.prince@example.com", "555-3456", "101 Wonder Way, Themyscira", "Friend"));
            contactRepository.save(new Contact("Evan", "Wright", "evan.wright@example.com", "555-7890", "202 Tech Blvd, Silicon Valley", "Colleague"));
        }
    }
}
