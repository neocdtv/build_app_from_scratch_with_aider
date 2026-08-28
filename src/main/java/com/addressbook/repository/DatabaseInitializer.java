package com.addressbook.repository;

import org.springframework.boot.CommandLineRunner;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import com.addressbook.model.Contact;

public class DatabaseInitializer implements CommandLineRunner {

    private static final List<Contact> SAMPLE_CONTACTS = List.of(
        new Contact()
            .setFirstName("John")
            .setLastName("Smith")
            .setEmail("john.smith@example.com")
            .setPhoneNumber("+1-555-0123")
            .setAddress("123 Main St, Springfield")
            .setCategory("Family"),
        
        new Contact()
            .setFirstName("Sarah")
            .setLastName("Johnson")
            .setEmail("sarah.johnson@example.com")
            .setPhoneNumber("+1-555-0456")
            .setAddress("456 Oak Ave, Portland")
            .setCategory("Work"),
        
        new Contact()
            .setFirstName("Michael")
            .setLastName("Williams")
            .setEmail("michael.williams@example.com")
            .setPhoneNumber("+1-555-0789")
            .setAddress("789 Pine Rd, Seattle")
            .setCategory("Friends"),
        
        new Contact()
            .setFirstName("Emily")
            .setLastName("Brown")
            .setEmail("emily.brown@example.com")
            .setPhoneNumber("+1-555-0321")
            .setAddress("321 Elm Blvd, Austin")
            .setCategory("Family"),
        
        new Contact()
            .setFirstName("David")
            .setLastName("Davis")
            .setEmail("david.davis@example.com")
            .setPhoneNumber("+1-555-0654")
            .setAddress("654 Maple Dr, Denver")
            .setCategory("Colleagues")
    );

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void run(String... args) throws Exception {
        // Check if table exists and has records before inserting sample data
        Long existingCount = (Long) entityManager.createQuery(
                "SELECT COUNT(c.id) FROM Contact c"
            ).getSingleResult();
            
        if (existingCount == 0L) {
            for (Contact contact : SAMPLE_CONTACTS) {
                entityManager.persist(contact);
            }
            System.out.println("Sample data initialized successfully!");
        } else {
            System.out.println("Database already contains " + existingCount + " contacts. Skipping initialization.");
        }
    }
}
