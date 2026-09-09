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
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            // Seed sample contacts only on empty database startup
            seedContacts();
        }
    }

    private void seedContacts() {
        Contact c1 = new Contact();
        c1.setFirstName("Alice");
        c1.setLastName("Johnson");
        c1.setEmail("alice.johnson@example.com");
        c1.setPhoneNumber("+1-555-1234");
        c1.setAddress("742 Evergreen Terrace, Springfield, USA");
        c1.setCategory("Family");
        repository.save(c1);

        Contact c2 = new Contact();
        c2.setFirstName("Bob");
        c2.setLastName("Smith");
        c2.setEmail("bob.smith@workmail.com");
        c2.setPhoneNumber("+1-555-9876");
        c2.setAddress("10 Downing Street, London, UK");
        c2.setCategory("Work");
        repository.save(c2);

        Contact c3 = new Contact();
        c3.setFirstName("Charlie");
        c3.setLastName("Brown");
        c3.setEmail("charlie.b@mailbox.org");
        c3.setPhoneNumber("+44 20 7946 0958");
        c3.setAddress("5 Maple Avenue, Toronto, Canada");
        c3.setCategory("Friends");
        repository.save(c3);

        Contact c4 = new Contact();
        c4.setFirstName("Diana");
        c4.setLastName("Prince");
        c4.setEmail("d.prince@royal.net");
        c4.setPhoneNumber("+1-555-4433");
        c4.setAddress("1600 Pennsylvania Ave NW, Washington, USA");
        c4.setCategory("Work");
        repository.save(c4);

        Contact c5 = new Contact();
        c5.setFirstName("Ethan");
        c5.setLastName("Hunt");
        c5.setEmail("ethan.h@imf.gov");
        c5.setPhoneNumber("+972 2 500 1234");
        c5.setAddress("Mission District, San Francisco, USA");
        c5.setCategory("Colleagues");
        repository.save(c5);

        System.out.println("Sample contacts seeded successfully.");
    }
}
