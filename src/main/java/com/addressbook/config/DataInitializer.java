package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    private final ContactRepository repository;
    public DataInitializer(ContactRepository repository) { this.repository = repository; }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            Contact c1 = new Contact(); c1.setFirstName("Alice"); c1.setLastName("Smith"); c1.setEmail("alice@example.com"); c1.setPhoneNumber("555-0101"); c1.setAddress("101 Oak Ave"); c1.setCategory("Family");
            Contact c2 = new Contact(); c2.setFirstName("Bob"); c2.setLastName("Jones"); c2.setEmail("bob@example.com"); c2.setPhoneNumber("555-0102"); c2.setAddress("202 Pine St"); c2.setCategory("Work");
            Contact c3 = new Contact(); c3.setFirstName("Charlie"); c3.setLastName("Brown"); c3.setEmail("charlie@example.com"); c3.setPhoneNumber("555-0103"); c3.setAddress("303 Elm Blvd"); c3.setCategory("Friends");
            Contact c4 = new Contact(); c4.setFirstName("Diana"); c4.setLastName("Prince"); c4.setEmail("diana@example.com"); c4.setPhoneNumber("555-0104"); c4.setAddress("404 Maple Dr"); c4.setCategory("Work");
            Contact c5 = new Contact(); c5.setFirstName("Ethan"); c5.setLastName("Hunt"); c5.setEmail("ethan@example.com"); c5.setPhoneNumber("555-0105"); c5.setAddress("505 Cedar Ln"); c5.setCategory("Family");
            repository.saveAll(List.of(c1, c2, c3, c4, c5));
        }
    }
}
