package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInitializer {
    @Bean
    CommandLineRunner initDatabase(ContactRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Contact() {{
                    setFirstName("John"); setLastName("Doe");
                    setEmail("john.doe@example.com"); setPhoneNumber("+1-555-1234");
                    setAddress("123 Main St, Anytown, USA"); setCategory("Family");
                }});
                repository.save(new Contact() {{
                    setFirstName("Jane"); setLastName("Smith");
                    setEmail("jane.smith@example.com"); setPhoneNumber("+1-555-5678");
                    setAddress("456 Oak Ave, Somewhere, USA"); setCategory("Work");
                }});
                repository.save(new Contact() {{
                    setFirstName("Alice"); setLastName("Johnson");
                    setEmail("alice.j@example.com"); setPhoneNumber("+1-555-9012");
                    setAddress("789 Pine Rd, Elsewhere, USA"); setCategory("Friends");
                }});
                repository.save(new Contact() {{
                    setFirstName("Bob"); setLastName("Brown");
                    setEmail("bob.brown@example.com"); setPhoneNumber("+1-555-3456");
                    setAddress("321 Elm St, Nowhere, USA"); setCategory("Family");
                }});
                repository.save(new Contact() {{
                    setFirstName("Carol"); setLastName("White");
                    setEmail("carol.white@example.com"); setPhoneNumber("+1-555-7890");
                    setAddress("654 Maple Dr, Anywhere, USA"); setCategory("Work");
                }});
            }
        };
    }
}
