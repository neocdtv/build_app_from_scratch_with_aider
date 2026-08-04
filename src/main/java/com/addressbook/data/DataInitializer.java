package com.addressbook.data;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (contactRepository.count() == 0) {
            // Create sample contacts
            Contact contact1 = new Contact("John", "Doe", "john.doe@email.com", "555-1234", "123 Main St, City", "Family");
            Contact contact2 = new Contact("Jane", "Smith", "jane.smith@email.com", "555-5678", "456 Oak Ave, Town", "Friend");
            Contact contact3 = new Contact("Bob", "Johnson", "bob.johnson@email.com", "555-9012", "789 Pine Rd, Village", "Colleague");
            Contact contact4 = new Contact("Alice", "Williams", "alice.williams@email.com", "555-3456", "321 Elm St, Borough", "Family");
            Contact contact5 = new Contact("Charlie", "Brown", "charlie.brown@email.com", "555-7890", "654 Maple Dr, Hamlet", "Friend");
            
            // Save contacts
            contactRepository.save(contact1);
            contactRepository.save(contact2);
            contactRepository.save(contact3);
            contactRepository.save(contact4);
            contactRepository.save(contact5);
        }
    }
}
