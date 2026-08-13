package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (contactRepository.count() == 0) {
            // Seed sample contacts
            Contact[] samples = {
                createContact("John", "Doe", "john.doe@example.com", "+1-555-1234", "123 Main St", "Family"),
                createContact("Jane", "Smith", "jane.smith@example.com", "+1-555-5678", "456 Oak Ave", "Work"),
                createContact("Alice", "Johnson", "alice.j@example.com", "+1-555-9012", "789 Pine Rd", "Friend"),
                createContact("Bob", "Brown", "bob.brown@example.com", "+1-555-3456", "321 Elm St", "Work"),
                createContact("Charlie", "Davis", "charlie.d@example.com", "+1-555-7890", "654 Maple Dr", "Family")
            };
            
            for (Contact contact : samples) {
                contactRepository.save(contact);
            }
        }
    }

    private Contact createContact(String firstName, String lastName, String email, 
                                  String phoneNumber, String address, String category) {
        Contact c = new Contact();
        c.setFirstName(firstName);
        c.setLastName(lastName);
        c.setEmail(email);
        c.setPhoneNumber(phoneNumber);
        c.setAddress(address);
        c.setCategory(category);
        return c;
    }
}
