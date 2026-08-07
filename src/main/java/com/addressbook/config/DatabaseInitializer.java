package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInitializer {
    @Bean
    CommandLineRunner initData(ContactRepository repo) {
        return args -> {
            if (repo.count() > 0) return;
            repo.save(new Contact()); // firstName=John, lastName=Doe...
            // Manually set fields for the 5 seed records
            var c1 = new Contact(); c1.setFirstName("John"); c1.setLastName("Doe"); c1.setEmail("john.doe@example.com"); c1.setPhoneNumber("+1-555-0101"); c1.setAddress("123 Main St, NYC"); c1.setCategory("Family");
            var c2 = new Contact(); c2.setFirstName("Jane"); c2.setLastName("Smith"); c2.setEmail("jane.smith@example.com"); c2.setPhoneNumber("+1-555-0102"); c2.setAddress("456 Oak Ave, LA"); c2.setCategory("Work");
            var c3 = new Contact(); c3.setFirstName("Alice"); c3.setLastName("Johnson"); c3.setEmail("alice.j@example.com"); c3.setPhoneNumber("+1-555-0103"); c3.setAddress("789 Pine Rd, Chicago"); c3.setCategory("Friend");
            var c4 = new Contact(); c4.setFirstName("Bob"); c4.setLastName("Williams"); c4.setEmail("bob.w@example.com"); c4.setPhoneNumber("+1-555-0104"); c4.setAddress("321 Elm St, Houston"); c4.setCategory("Work");
            var c5 = new Contact(); c5.setFirstName("Carol"); c5.setLastName("Brown"); c5.setEmail("carol.b@example.com"); c5.setPhoneNumber("+1-555-0105"); c5.setAddress("654 Maple Ln, Phoenix"); c5.setCategory("Family");
            repo.saveAll(java.util.List.of(c1, c2, c3, c4, c5));
        };
    }
}
