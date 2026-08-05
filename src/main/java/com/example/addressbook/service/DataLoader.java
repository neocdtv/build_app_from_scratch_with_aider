package com.example.addressbook.service;

import com.example.addressbook.model.Contact;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final ContactService contactService;

    public DataLoader(ContactService contactService) {
        this.contactService = contactService;
    }

    @Override
    public void run(String... args) throws Exception {
        seedData();
    }

    private void seedData() {
        Contact c1 = new Contact();
        c1.setFirstName("John");
        c1.setLastName("Doe");
        c1.setEmail("john.doe@example.com");
        c1.setPhoneNumber("+1-555-1234");
        c1.setAddress("123 Main St, Springfield");
        c1.setCategory("Friend");
        contactService.createContact(c1);

        Contact c2 = new Contact();
        c2.setFirstName("Jane");
        c2.setLastName("Smith");
        c2.setEmail("jane.smith@example.com");
        c2.setPhoneNumber("+1-555-5678");
        c2.setAddress("456 Oak Ave, Metropolis");
        c2.setCategory("Work");
        contactService.createContact(c2);

        Contact c3 = new Contact();
        c3.setFirstName("Alice");
        c3.setLastName("Johnson");
        c3.setEmail("alice.j@example.com");
        c3.setPhoneNumber("+1-555-9012");
        c3.setAddress("789 Pine Rd, Gotham");
        c3.setCategory("Family");
        contactService.createContact(c3);

        Contact c4 = new Contact();
        c4.setFirstName("Bob");
        c4.setLastName("Brown");
        c4.setEmail("bob.brown@example.com");
        c4.setPhoneNumber("+1-555-3456");
        c4.setAddress("321 Elm St, Star City");
        c4.setCategory("Friend");
        contactService.createContact(c4);

        Contact c5 = new Contact();
        c5.setFirstName("Charlie");
        c5.setLastName("Davis");
        c5.setEmail("charlie.d@example.com");
        c5.setPhoneNumber("+1-555-7890");
        c5.setAddress("654 Maple Dr, Central City");
        c5.setCategory("Work");
        contactService.createContact(c5);
    }
}
