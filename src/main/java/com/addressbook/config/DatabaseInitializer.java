package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInitializer {

    @Bean
    public CommandLineRunner initDataBase(ContactService contactService) {
        return args -> {
            if (contactService.findAll().isEmpty()) {
                Contact c1 = new Contact();
                c1.setFirstName("John");
                c1.setLastName("Doe");
                c1.setEmail("john.doe@example.com");
                c1.setPhoneNumber("+1-555-1234");
                c1.setAddress("123 Main Street, Anytown, USA");
                c1.setCategory("Family");
                contactService.create(c1);

                Contact c2 = new Contact();
                c2.setFirstName("Jane");
                c2.setLastName("Smith");
                c2.setEmail("jane.smith@example.com");
                c2.setPhoneNumber("+1-555-5678");
                c2.setAddress("456 Oak Avenue, Anytown, USA");
                c2.setCategory("Work");
                contactService.create(c2);

                Contact c3 = new Contact();
                c3.setFirstName("Alice");
                c3.setLastName("Johnson");
                c3.setEmail("alice.johnson@example.com");
                c3.setPhoneNumber("+1-555-9012");
                c3.setAddress("789 Pine Road, Anytown, USA");
                c3.setCategory("Family");
                contactService.create(c3);

                Contact c4 = new Contact();
                c4.setFirstName("Bob");
                c4.setLastName("Brown");
                c4.setEmail("bob.brown@example.com");
                c4.setPhoneNumber("+1-555-3456");
                c4.setAddress("321 Elm Street, Anytown, USA");
                c4.setCategory("Work");
                contactService.create(c4);

                Contact c5 = new Contact();
                c5.setFirstName("Charlie");
                c5.setLastName("Davis");
                c5.setEmail("charlie.davis@example.com");
                c5.setPhoneNumber("+1-555-7890");
                c5.setAddress("654 Maple Lane, Anytown, USA");
                c5.setCategory("Friends");
                contactService.create(c5);
            }
        };
    }
}
