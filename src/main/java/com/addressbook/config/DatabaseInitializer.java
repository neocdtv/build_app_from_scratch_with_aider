package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.service.ContactService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationRunner {
    private final ContactService service;

    public DatabaseInitializer(ContactService service) {
        this.service = service;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (service.findAll().isEmpty()) {
            String[] firstNames = {"John", "Jane", "Alice", "Bob", "Charlie"};
            String[] lastNames = {"Doe", "Smith", "Johnson", "Williams", "Brown"};
            String[] categories = {"Family", "Work", "Friends", "Colleague", "Network"};

            for (int i = 0; i < 5; i++) {
                Contact c = new Contact();
                c.setFirstName(firstNames[i]);
                c.setLastName(lastNames[i]);
                c.setEmail(c.getFirstName().toLowerCase() + "." + c.getLastName().toLowerCase() + "@example.com");
                c.setPhoneNumber("+1-555-" + String.format("%04d", i * 1000));
                c.setAddress(i + " Main Street, Springville, USA");
                c.setCategory(categories[i]);
                service.create(c);
            }
        }
    }
}
