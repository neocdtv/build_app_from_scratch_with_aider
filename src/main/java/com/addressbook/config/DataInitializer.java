package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ContactService contactService;

    @Override
    public void run(String... args) throws Exception {
        if (contactService.getAllContacts().isEmpty()) {
            contactService.createContact(new Contact() {{ setFirstName("John"); setLastName("Doe"); setEmail("john.doe@example.com"); setPhoneNumber("+1-555-0101"); setAddress("123 Main St"); setCategory("Family"); }});
            contactService.createContact(new Contact() {{ setFirstName("Jane"); setLastName("Smith"); setEmail("jane.smith@example.com"); setPhoneNumber("+1-555-0102"); setAddress("456 Oak Ave"); setCategory("Work"); }});
            contactService.createContact(new Contact() {{ setFirstName("Bob"); setLastName("Johnson"); setEmail("bob.j@example.com"); setPhoneNumber("+1-555-0103"); setAddress("789 Pine Rd"); setCategory("Friend"); }});
            contactService.createContact(new Contact() {{ setFirstName("Alice"); setLastName("Brown"); setEmail("alice.b@example.com"); setPhoneNumber("+1-555-0104"); setAddress("101 Elm St"); setCategory("Work"); }});
            contactService.createContact(new Contact() {{ setFirstName("Charlie"); setLastName("Davis"); setEmail("charlie.d@example.com"); setPhoneNumber("+1-555-0105"); setAddress("202 Maple Ln"); setCategory("Family"); }});
        }
    }
}
