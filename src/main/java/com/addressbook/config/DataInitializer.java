package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ContactRepository repository;

    public DataInitializer(ContactRepository repository) { this.repository = repository; }

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            repository.save(createContact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main Street, Anytown, USA", "Family"));
            repository.save(createContact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Avenue, Somewhere, USA", "Work"));
            repository.save(createContact("Alice", "Johnson", "alice.j@example.com", "+1-555-9012", "789 Pine Road, Elsewhere, USA", "Friends"));
            repository.save(createContact("Bob", "Brown", "bob.brown@example.com", "+1-555-3456", "321 Elm Street, Nowhere, USA", "Family"));
            repository.save(createContact("Charlie", "Davis", "charlie.d@example.com", "+1-555-7890", "654 Maple Lane, Somewhere, USA", "Work"));
        }
    }

    private Contact createContact(String fn, String ln, String email, String phone, String addr, String cat) {
        Contact c = new Contact();
        c.setFirstName(fn); c.setLastName(ln); c.setEmail(email);
        c.setPhoneNumber(phone); c.setAddress(addr); c.setCategory(cat);
        return c;
    }
}
