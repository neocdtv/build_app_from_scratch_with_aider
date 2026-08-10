package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(ContactService service) {
        return args -> {
            if (service.findAll().isEmpty()) {
                String[] firstNames = {"John", "Jane", "Alice", "Bob", "Charlie"};
                String[] lastNames = {"Doe", "Smith", "Johnson", "Williams", "Brown"};
                String[] categories = {"Family", "Work", "Friends", "Colleague", "Networking"};
                
                for (int i = 0; i < 5; i++) {
                    Contact c = new Contact();
                    c.setFirstName(firstNames[i]);
                    c.setLastName(lastNames[i]);
                    c.setEmail(firstNames[i].toLowerCase() + ".last" + i + "@example.com");
                    c.setPhoneNumber("+1-555-" + String.format("%04d", 1000 + i));
                    c.setAddress(i * 100 + " Main St, Anytown, USA");
                    c.setCategory(categories[i]);
                    service.save(c);
                }
            }
        };
    }
}
