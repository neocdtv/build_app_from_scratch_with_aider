package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final ContactRepository contactRepository;

    public DatabaseInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /** Five diverse sample contacts used to populate the H2 database on startup. */
    private List<Contact> getSampleContacts() {
        return Arrays.asList(
                new Contact("Alice", "Johnson",     "alice.johnson@example.com",   "(555) 123-4001", "123 Maple Street, Springfield",       "Family"),
                new Contact("Bob",      "Smith",      "bob.smith@example.com",         "(555) 987-6543", "45 Oak Avenue, Portland",             "Friend"),
                new Contact("Carol",    "Williams",   "carol.williams@example.com",    "(555) 456-7890", "78 Pine Road, Seattle",               "Colleague"),
                new Contact("David",    "Brown",      "david.brown@example.com",       "(555) 222-3333", "91 Cedar Lane, Boston",               "Neighbor"),
                new Contact("Emma",     "Davis",      "emma.davis@example.com",        "(555) 777-8888", "22 Elm Street, Denver",               "Personal"));
    }

    @Override
    public void run(ApplicationArguments args) {
        if (contactRepository.count() == 0L) {
            contactRepository.saveAll(getSampleContacts());
            log.info("Pre-populated {} sample contacts into the database.", getSampleContacts().size());
        } else {
            log.debug("Database already contains contacts; skipping initialization.");
        }
    }
}
