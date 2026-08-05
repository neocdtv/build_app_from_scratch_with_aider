package com.example.addressbook.config;

import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner initDatabase(ContactRepository contactRepository) {
        return args -> {
            if (contactRepository.count() == 0) {
                Contact c1 = new Contact();
                c1.setFirstName("John");
                c1.setLastName("Smith");
                c1.setEmail("john.smith@example.com");
                c1.setPhoneNumber("+14155551234");
                c1.setAddress("123 Main St, San Francisco, CA 94102");
                c1.setCategory("Work");
                contactRepository.save(c1);

                Contact c2 = new Contact();
                c2.setFirstName("Jane");
                c2.setLastName("Doe");
                c2.setEmail("jane.doe@example.com");
                c2.setPhoneNumber("+14155555678");
                c2.setAddress("456 Oak Ave, New York, NY 10001");
                c2.setCategory("Personal");
                contactRepository.save(c2);

                Contact c3 = new Contact();
                c3.setFirstName("Bob");
                c3.setLastName("Johnson");
                c3.setEmail("bob.johnson@example.com");
                c3.setPhoneNumber("+14155559012");
                c3.setAddress("789 Pine Rd, Chicago, IL 60601");
                c3.setCategory("Family");
                contactRepository.save(c3);

                Contact c4 = new Contact();
                c4.setFirstName("Alice");
                c4.setLastName("Williams");
                c4.setEmail("alice.williams@example.com");
                c4.setPhoneNumber("+14155553456");
                c4.setAddress("321 Elm St, Boston, MA 02101");
                c4.setCategory("Work");
                contactRepository.save(c4);

                Contact c5 = new Contact();
                c5.setFirstName("Charlie");
                c5.setLastName("Brown");
                c5.setEmail("charlie.brown@example.com");
                c5.setPhoneNumber("+14155557890");
                c5.setAddress("654 Maple Dr, Seattle, WA 98101");
                c5.setCategory("Personal");
                contactRepository.save(c5);
            }
        };
    }
}
