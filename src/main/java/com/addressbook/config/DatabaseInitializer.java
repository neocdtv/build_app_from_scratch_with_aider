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
        // Sample Contact 1
        Contact contact1 = new Contact();
        contact1.setFirstName("John");
        contact1.setLastName("Doe");
        contact1.setEmail("john.doe@example.com");
        contact1.setPhoneNumber("555-0101");
        contact1.setAddress("123 Main St, Springfield");
        contact1.setCategory("Family");
        contactRepository.save(contact1);

        // Sample Contact 2
        Contact contact2 = new Contact();
        contact2.setFirstName("Jane");
        contact2.setLastName("Smith");
        contact2.setEmail("jane.smith@example.com");
        contact2.setPhoneNumber("555-0102");
        contact2.setAddress("456 Oak Ave, Riverside");
        contact2.setCategory("Work");
        contactRepository.save(contact2);

        // Sample Contact 3
        Contact contact3 = new Contact();
        contact3.setFirstName("Michael");
        contact3.setLastName("Johnson");
        contact3.setEmail("michael.j@example.com");
        contact3.setPhoneNumber("555-0103");
        contact3.setAddress("789 Pine Rd, Lakeside");
        contact3.setCategory("Friends");
        contactRepository.save(contact3);

        // Sample Contact 4
        Contact contact4 = new Contact();
        contact4.setFirstName("Emily");
        contact4.setLastName("Williams");
        contact4.setEmail("emily.w@example.com");
        contact4.setPhoneNumber("555-0104");
        contact4.setAddress("321 Elm St, Mountain View");
        contact4.setCategory("Work");
        contactRepository.save(contact4);

        // Sample Contact 5
        Contact contact5 = new Contact();
        contact5.setFirstName("David");
        contact5.setLastName("Brown");
        contact5.setEmail("david.b@example.com");
        contact5.setPhoneNumber("555-0105");
        contact5.setAddress("654 Maple Dr, Valley");
        contact5.setCategory("Family");
        contactRepository.save(contact5);

        System.out.println("Database initialized with 5 sample contacts.");
    }
}
