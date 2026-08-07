package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ContactService service;

    public DatabaseInitializer(ContactService service) {
        this.service = service;
    }

    @Override
    public void run(String... args) {
        seed(new Contact("John", "Doe", "john@example.com", "1234567890", "123 St", "Family"));
        seed(new Contact("Jane", "Smith", "jane@work.com", "0987654321", "456 Ave", "Work"));
        seed(new Contact("Bob", "Jones", "bob@home.com", "5556667777", "789 Rd", "Family"));
        seed(new Contact("Alice", "Wonder", "alice@magic.com", "1112223333", "Wonderland", "Friend"));
        seed(new Contact("Charlie", "Brown", "charlie@peanuts.com", "4445556666", "Peanuts Ln", "Work"));
    }

    private void seed(Contact contact) {
        service.saveContact(contact);
    }
}
