package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    private final ContactService service;

    public DatabaseInitializer(ContactService service) {
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (service.findAll().isEmpty()) {
            service.save(new Contact() {{ setFirstName("John"); setLastName("Doe"); setEmail("john.doe@example.com"); setPhoneNumber("+1-555-1234"); setAddress("123 Main Street, Anytown, USA"); setCategory("Family"); }});
            service.save(new Contact() {{ setFirstName("Jane"); setLastName("Smith"); setEmail("jane.smith@example.com"); setPhoneNumber("+1-555-5678"); setAddress("456 Oak Avenue, Somewhere, USA"); setCategory("Work"); }});
            service.save(new Contact() {{ setFirstName("Robert"); setLastName("Johnson"); setEmail("robert.j@example.com"); setPhoneNumber("+1-555-9012"); setAddress("789 Pine Road, Elsewhere, USA"); setCategory("Friends"); }});
            service.save(new Contact() {{ setFirstName("Emily"); setLastName("Davis"); setEmail("emily.d@example.com"); setPhoneNumber("+1-555-3456"); setAddress("321 Maple Lane, Nowhere, USA"); setCategory("Family"); }});
            service.save(new Contact() {{ setFirstName("Michael"); setLastName("Brown"); setEmail("michael.b@example.com"); setPhoneNumber("+1-555-7890"); setAddress("654 Cedar Blvd, Somewhere, USA"); setCategory("Work"); }});
        }
    }
}
