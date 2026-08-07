package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(ContactRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(createSample("John", "Doe", "john.doe@example.com", "+1-555-0101", "123 Main St, Anytown", "Family"));
                repository.save(createSample("Jane", "Smith", "jane.smith@work.com", "+1-555-0102", "456 Oak Ave, Workville", "Work"));
                repository.save(createSample("Alice", "Johnson", "alice.j@mail.com", "+1-555-0103", "789 Pine Ln, Suburbia", "Friends"));
                repository.save(createSample("Bob", "Williams", "bob.w@example.net", "+1-555-0104", "321 Elm St, City", "Work"));
                repository.save(createSample("Carol", "Brown", "carol.b@domain.org", "+1-555-0105", "654 Maple Dr, Town", "Family"));
            }
        };
    }

    private Contact createSample(String first, String last, String email, String phone, String address, String category) {
        Contact c = new Contact();
        c.setFirstName(first); c.setLastName(last);
        c.setEmail(email); c.setPhoneNumber(phone);
        c.setAddress(address); c.setCategory(category);
        return c;
    }
}
