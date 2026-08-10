package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ContactRepository repository;

    public DatabaseInitializer(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        seed("John", "Doe", "john@example.com", "1234567890", "123 Main St", "Family");
        seed("Jane", "Smith", "jane@work.com", "0987654321", "456 Corp Ave", "Work");
        seed("Bob", "Wilson", "bob@home.com", "1122334455", "789 Oak Rd", "Family");
        seed("Alice", "Brown", "alice@tech.com", "5566778899", "321 Pine Ln", "Work");
        seed("Charlie", "Davis", "charlie@web.com", "9988776655", "654 Elm St", "Other");
    }

    private void seed(String fn, String ln, String email, String phone, String addr, String cat) {
        Contact c = new Contact();
        c.setFirstName(fn);
        c.setLastName(ln);
        c.setEmail(email);
        c.setPhoneNumber(phone);
        c.setAddress(addr);
        c.setCategory(cat);
        repository.save(c);
    }
}
