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
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            repository.save(createContact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St", "Family"));
            repository.save(createContact("Jane", "Smith", "jane.smith@work.com", "+1-555-5678", "456 Office Blvd", "Work"));
            repository.save(createContact("Alice", "Johnson", "alice.j@gmail.com", "+1-555-9012", "789 Park Ave", "Friend"));
            repository.save(createContact("Bob", "Brown", "bob.b@provider.net", "+1-555-3456", "321 Lake Rd", "Family"));
            repository.save(createContact("Charlie", "Davis", "charlie.d@corp.com", "+1-555-7890", "654 Industry Way", "Work"));
        }
    }

    private Contact createContact(String firstName, String lastName, String email, String phone, String address, String category) {
        Contact contact = new Contact();
        contact.setFirstName(firstName);
        contact.setLastName(lastName);
        contact.setEmail(email);
        contact.setPhoneNumber(phone);
        contact.setAddress(address);
        contact.setCategory(category);
        return contact;
    }
}
