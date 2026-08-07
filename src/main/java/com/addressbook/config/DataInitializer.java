package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository repository;

    public DataInitializer(ContactRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        repository.save(new Contact());
        var c1 = new Contact(); c1.setFirstName("Alice"); c1.setLastName("Johnson"); 
        c1.setEmail("alice.johnson@example.com"); c1.setPhoneNumber("+1-555-1001"); 
        c1.setAddress("100 Maple Ave, Springfield"); c1.setCategory("Family");
        repository.save(c1);

        var c2 = new Contact(); c2.setFirstName("Bob"); c2.setLastName("Smith"); 
        c2.setEmail("bob.smith@example.com"); c2.setPhoneNumber("+1-555-1002"); 
        c2.setAddress("200 Oak Dr, Shelbyville"); c2.setCategory("Work");
        repository.save(c2);

        var c3 = new Contact(); c3.setFirstName("Carol"); c3.setLastName("White"); 
        c3.setEmail("carol.white@example.com"); c3.setPhoneNumber("+1-555-1003"); 
        c3.setAddress("300 Pine Ln, Capital City"); c3.setCategory("Friends");
        repository.save(c3);

        var c4 = new Contact(); c4.setFirstName("David"); c4.setLastName("Brown"); 
        c4.setEmail("david.brown@example.com"); c4.setPhoneNumber("+1-555-1004"); 
        c4.setAddress("400 Cedar St, Ogdenville"); c4.setCategory("Work");
        repository.save(c4);

        var c5 = new Contact(); c5.setFirstName("Eve"); c5.setLastName("Davis"); 
        c5.setEmail("eve.davis@example.com"); c5.setPhoneNumber("+1-555-1005"); 
        c5.setAddress("500 Birch Rd, North Haverbrook"); c5.setCategory("Family");
        repository.save(c5);
    }
}
