package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ContactRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Contact c1 = new Contact();
                c1.setFirstName("John"); c1.setLastName("Doe"); c1.setEmail("john.doe@example.com");
                c1.setPhoneNumber("+1-555-1234"); c1.setAddress("123 Main St"); c1.setCategory("Family");
                repository.save(c1);

                Contact c2 = new Contact();
                c2.setFirstName("Jane"); c2.setLastName("Smith"); c2.setEmail("jane.smith@example.com");
                c2.setPhoneNumber("+1-555-9876"); c2.setAddress("456 Oak Ave"); c2.setCategory("Work");
                repository.save(c2);

                Contact c3 = new Contact();
                c3.setFirstName("Alice"); c3.setLastName("Johnson"); c3.setEmail("alice.j@example.com");
                c3.setPhoneNumber("+1-555-4567"); c3.setAddress("789 Pine Rd"); c3.setCategory("Friends");
                repository.save(c3);

                Contact c4 = new Contact();
                c4.setFirstName("Bob"); c4.setLastName("Brown"); c4.setEmail("bob.b@example.com");
                c4.setPhoneNumber("+1-555-7890"); c4.setAddress("321 Elm St"); c4.setCategory("Work");
                repository.save(c4);

                Contact c5 = new Contact();
                c5.setFirstName("Charlie"); c5.setLastName("Davis"); c5.setEmail("charlie.d@example.com");
                c5.setPhoneNumber("+1-555-3210"); c5.setAddress("654 Maple Dr"); c5.setCategory("Family");
                repository.save(c5);
            }
        };
    }
}
