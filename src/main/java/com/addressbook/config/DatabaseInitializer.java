package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    private final ContactRepository contactRepository;
    
    @Autowired
    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Clear existing data to avoid duplicates on restart
        contactRepository.deleteAll();
        
        // Sample contacts to pre-populate
        Contact contact1 = new Contact(
            "John",
            "Smith",
            "john.smith@email.com",
            "555-0101",
            "123 Main St, Springfield",
            "Family"
        );
        
        Contact contact2 = new Contact(
            "Sarah",
            "Johnson",
            "sarah.j@email.com",
            "555-0102",
            "456 Oak Ave, Riverside",
            "Work"
        );
        
        Contact contact3 = new Contact(
            "Michael",
            "Williams",
            "m.williams@email.com",
            "555-0103",
            "789 Pine Rd, Hilltown",
            "Friend"
        );
        
        Contact contact4 = new Contact(
            "Emily",
            "Brown",
            "emily.brown@email.com",
            "555-0104",
            "321 Elm St, Lakewood",
            "Work"
        );
        
        Contact contact5 = new Contact(
            "David",
            "Davis",
            "d.davis@email.com",
            "555-0105",
            "654 Cedar Blvd, Brookfield",
            "Family"
        );
        
        contactRepository.save(contact1);
        contactRepository.save(contact2);
        contactRepository.save(contact3);
        contactRepository.save(contact4);
        contactRepository.save(contact5);
    }
}
