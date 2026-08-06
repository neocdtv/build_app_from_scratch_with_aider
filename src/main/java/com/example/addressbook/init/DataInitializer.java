package com.example.addressbook.init;

import com.example.addressbook.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ContactRepository repository;

    public DataInitializer(ContactRepository repository) { this.repository = repository; }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;
        List<Contact> samples = Arrays.asList(
            create("John", "Doe", "john.doe@example.com", "555-0101", "123 Main St", "Work"),
            create("Jane", "Smith", "jane.smith@email.com", "555-0102", "456 Oak Ave", "Friend"),
            create("Robert", "Brown", "r.brown@test.org", "555-0103", "789 Pine Rd", "Family"),
            create("Emily", "Davis", "emily.d@dev.io", "555-0104", "321 Elm Blvd", "Work"),
            create("Michael", "Wilson", "mwilson@mail.com", "555-0105", "654 Cedar Ln", "Friend")
        );
        repository.saveAll(samples);
    }

    private Contact create(String f, String l, String e, String p, String a, String c) {
        Contact contact = new Contact();
        contact.setFirstName(f); contact.setLastName(l); contact.setEmail(e);
        contact.setPhone(p); contact.setAddress(a); contact.setCategory(c);
        return contact;
    }
}
